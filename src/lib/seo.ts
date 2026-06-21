import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getPathname } from "@/i18n/navigation";
import { getPageBySlug, getSiteSettings } from "./queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const KEYWORDS_FR = [
  "gîte Sologne",
  "location vacances Romorantin-Lanthenay",
  "gîte Loir-et-Cher",
  "hébergement cavaliers Sologne",
  "gîte proche Grand Parquet",
  "gîte proche Grand Parquet Lamotte-Beuvron",
  "location séjour concours équestre Sologne",
  "gîte proche châteaux Loire",
  "que faire en Sologne",
  "location Chambord",
  "gîte 6 personnes Sologne",
];

const KEYWORDS_EN = [
  "holiday cottage Sologne",
  "Romorantin-Lanthenay rental",
  "Loir-et-Cher gite",
  "equestrian accommodation Sologne",
  "cottage near Grand Parquet",
  "cottage near Grand Parquet Lamotte-Beuvron",
  "Loire Valley chateau holiday rental",
  "Sologne nature holiday",
  "Chambord accommodation",
  "Sologne 6 people cottage",
];

const GOOGLEBOT_DIRECTIVES = {
  "max-image-preview": "large" as const,
  "max-snippet": -1,
  "max-video-preview": -1,
};

type PageSeoProps = {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  extraKeywords?: string[];
};

export function generatePageMetadata({
  title,
  description,
  locale,
  path,
  ogImage,
  noIndex,
  absoluteTitle,
  extraKeywords,
}: PageSeoProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const frPath = getPathname({ href: path as any, locale: "fr" });
  const enPath = getPathname({ href: path as any, locale: "en" });
  const alternateFr = `${SITE_URL}${frPath}`;
  const alternateEn = `${SITE_URL}/en${enPath === "/" ? "" : enPath}`;

  const ogTitle = title.includes("L'Instant Tranquille")
    ? title
    : `${title}, L'Instant Tranquille`;

  const baseKeywords = locale === "fr" ? KEYWORDS_FR : KEYWORDS_EN;
  const keywords = extraKeywords
    ? [...baseKeywords, ...extraKeywords]
    : baseKeywords;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {
          robots: {
            index: true,
            follow: true,
            googleBot: GOOGLEBOT_DIRECTIVES,
          },
        }),
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
  const ogImage = getMediaUrl(seo?.ogImage) || getMediaUrl(defaultSeo?.ogImage);

  return generatePageMetadata({
    title,
    description,
    locale,
    path,
    ogImage,
    absoluteTitle: options?.absoluteTitle,
  });
}
