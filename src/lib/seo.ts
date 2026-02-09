import type { Metadata } from "next";
import { type Locale } from "@/i18n/config";
import { getSiteSettings, getPageBySlug } from "./queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type PageSeoProps = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  ogImage,
  noIndex,
  absoluteTitle,
}: PageSeoProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const alternateFr = `${SITE_URL}${path}`;
  const alternateEn = `${SITE_URL}/en${path === "/" ? "" : path}`;

  const ogTitle = title.includes("L'Instant Tranquille")
    ? title
    : `${title} — L'Instant Tranquille`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(noIndex && { robots: { index: false, follow: false } }),
    alternates: {
      canonical: url,
      languages: {
        fr: alternateFr,
        en: alternateEn,
        "x-default": alternateFr,
      },
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: "L'Instant Tranquille",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? "en_GB" : "fr_FR",
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

function getMediaUrl(media: any): string | undefined {
  if (!media || typeof media === "string" || typeof media === "number")
    return undefined;
  return media.sizes?.hero?.url || media.url || undefined;
}

export async function generateCmsPageMetadata(
  slug: string,
  locale: Locale,
  path: string,
  fallbackTitle: string,
  fallbackDescription: string,
  options?: { absoluteTitle?: boolean },
): Promise<Metadata> {
  const [page, siteSettings] = await Promise.all([
    getPageBySlug(slug, locale),
    getSiteSettings(locale),
  ]);

  const seo = page?.seo as Record<string, any> | undefined;
  const defaultSeo = (siteSettings as Record<string, any>).defaultSeo as
    | Record<string, any>
    | undefined;

  const title = seo?.metaTitle || fallbackTitle;
  const description = seo?.metaDescription || fallbackDescription;
  const ogImage =
    getMediaUrl(seo?.ogImage) || getMediaUrl(defaultSeo?.ogImage);

  return generatePageMetadata({
    title,
    description,
    locale,
    path,
    ogImage,
    absoluteTitle: options?.absoluteTitle,
  });
}
