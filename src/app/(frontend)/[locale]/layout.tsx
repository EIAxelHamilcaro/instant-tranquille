import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { playfairDisplay, lora, inter } from "@/lib/fonts";
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
  const settings = (await getSiteSettings(locale)) as Record<string, any>;
  const siteName = settings.siteName || "L'Instant Tranquille";
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s — ${siteName}`,
      default: `${siteName} — ${messages.metadata.title}`,
    },
    description: messages.metadata.description,
    category: "travel",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="dns-prefetch"
          href="https://challenges.cloudflare.com"
        />
        <meta name="geo.region" content="FR-CVL" />
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
