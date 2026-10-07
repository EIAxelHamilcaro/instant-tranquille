import type { Metadata, Viewport } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LivePreviewRefresh } from "@/components/layout/LivePreviewRefresh";
import { Opening } from "@/components/layout/Opening";
import { OpeningGuard } from "@/components/layout/OpeningGuard";
import { SectionSizes } from "@/components/layout/SectionSizes";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { JsonLd } from "@/components/shared/JsonLd";
import { SoftImageReveal } from "@/components/shared/SoftImage";
import { routing } from "@/i18n/routing";
import { bricolage, newsreader } from "@/lib/fonts";
import { webSiteJsonLd } from "@/lib/jsonld";
import { getGlobal } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9ede5" },
    { media: "(prefers-color-scheme: dark)", color: "#0e2b28" },
  ],
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "common" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { template: `%s | ${t("siteName")}`, default: t("siteName") },
    applicationName: t("siteName"),
    appleWebApp: { title: t("siteName"), statusBarStyle: "default" },
    icons: {
      icon: [{ url: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    category: "travel",
    formatDetection: { telephone: false, email: false, address: false },
    other: {
      "geo.region": "FR-41",
      "geo.placename": "Romorantin-Lanthenay",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FrontendLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations("common");
  const { isEnabled: preview } = await draftMode();
  const settings = await getGlobal("site-settings", locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${bricolage.variable} ${newsreader.variable}`}
    >
      <body className="frontend-app flex min-h-screen flex-col">
        {!preview && <OpeningGuard />}
        <SoftImageReveal />
        <SectionSizes />
        <JsonLd data={webSiteJsonLd()} />
        <SmoothScroll />
        <NextIntlClientProvider>
          <a
            href="#contenu"
            className="ui evitement sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
          >
            {t("skipToContent")}
          </a>
          {!preview && (
            <Opening
              name={t("siteName")}
              baseline={settings.tagline ?? ""}
              skipLabel={t("opening.skip")}
              soundLabel={t("opening.sound")}
            />
          )}
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
          <BookingButtons
            settings={settings}
            compact
            className="barre-reservation"
          />
          {preview && <LivePreviewRefresh />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
