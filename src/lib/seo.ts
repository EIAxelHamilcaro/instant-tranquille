import type { Metadata } from "next";
import { type Locale, locales } from "@/i18n/config";
import { getPathname } from "@/i18n/navigation";
import {
  SHARE_IMAGE_SIZE,
  SHARE_IMAGE_TYPE,
  type ShareImage,
} from "@/lib/share-image/spec";
import type { Media } from "@/payload-types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export type Href = Parameters<typeof getPathname>[0]["href"];

const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };
export const SITE_NAME = "L'Instant Tranquille";

export function absoluteUrl(href: Href, locale: Locale) {
  const pathname = getPathname({ href, locale });

  return `${SITE_URL}${pathname === "/" ? "" : pathname}`;
}

export function mediaUrl(media: number | Media | null | undefined) {
  if (typeof media !== "object" || !media?.url) return undefined;

  const url = media.sizes?.share?.url ?? media.url;

  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

interface PluginMeta {
  title?: string | null;
  description?: string | null;
}

interface PageMetadataBase {
  locale: Locale;
  href: Href;
  title: string;
  description: string;
  meta?: PluginMeta | null;
  share: ShareImage;
  availableLocales?: readonly Locale[];
}

interface WebsiteMetadataOptions extends PageMetadataBase {
  type?: "website";
}

interface ArticleMetadataOptions extends PageMetadataBase {
  type: "article";
  publishedTime: string;
  modifiedTime: string;
}

type PageMetadataOptions = WebsiteMetadataOptions | ArticleMetadataOptions;

const PREVIEW_LIMITS = {
  "max-image-preview": "large",
  "max-snippet": -1,
  "max-video-preview": -1,
} as const;

export function pageMetadata(options: PageMetadataOptions): Metadata {
  const { locale, href, meta, share, availableLocales = locales } = options;
  const title = meta?.title || options.title;
  const description = meta?.description || options.description;
  const url = absoluteUrl(href, locale);
  const image = { url: share.url, alt: share.alt, ...SHARE_IMAGE_SIZE };
  const openGraph = {
    title,
    description,
    url,
    siteName: SITE_NAME,
    locale: OG_LOCALES[locale],
    alternateLocale: availableLocales
      .filter((code) => code !== locale)
      .map((code) => OG_LOCALES[code]),
    images: [{ ...image, secureUrl: share.url, type: SHARE_IMAGE_TYPE }],
  };

  return {
    title: { absolute: title },
    description,
    robots: {
      index: true,
      follow: true,
      ...PREVIEW_LIMITS,
      googleBot: PREVIEW_LIMITS,
    },
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          availableLocales.map((code) => [code, absoluteUrl(href, code)]),
        ),
        "x-default": absoluteUrl(href, "fr"),
      },
    },
    openGraph:
      options.type === "article"
        ? {
            ...openGraph,
            type: "article",
            publishedTime: options.publishedTime,
            modifiedTime: options.modifiedTime,
            authors: [SITE_NAME],
          }
        : { ...openGraph, type: "website" },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
