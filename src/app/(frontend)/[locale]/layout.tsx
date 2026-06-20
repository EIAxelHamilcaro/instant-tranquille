import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import type { Locale } from "@/i18n/config";
import { routing } from "@/i18n/routing";
import { inter, lora, playfairDisplay } from "@/lib/fonts";
import { generateWebSiteJsonLd } from "@/lib/jsonld";
import { getSiteSettings } from "@/lib/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#4a7c59",
  maximumScale: 5,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  const settings = (await getSiteSettings(locale)) as Record<string, unknown>;
  const siteName =
    (settings.siteName as string | undefined) || "L'Instant Tranquille";
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s, ${siteName}`,
      default: `${siteName}, ${messages.metadata.title}`,
    },
    description: messages.metadata.description,
    category: "travel",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "common" });
  const skipText = t("skipToContent");

  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <link rel="dns-prefetch" href="https://challenges.cloudflare.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
        <meta name="geo.region" content="FR-CVL" />
        <meta name="geo.placename" content="Romorantin-Lanthenay, Sologne" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${lora.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="frontend-app flex min-h-screen flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:font-sans focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
            >
              {skipText}
            </a>
            <Header locale={locale} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer locale={locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
