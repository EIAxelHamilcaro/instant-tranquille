import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { type Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { playfairDisplay, lora, inter } from "@/lib/fonts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#4a7c59",
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s — L'Instant Tranquille",
    default: "L'Instant Tranquille — Gîte de charme en Sologne",
  },
  description:
    "Découvrez L'Instant Tranquille, un gîte de charme au cœur de la Sologne.",
  category: "travel",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

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
  const skipText =
    locale === "fr" ? "Aller au contenu principal" : "Skip to main content";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fal.media" />
        <link
          rel="dns-prefetch"
          href="https://tile.openstreetmap.org"
        />
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
