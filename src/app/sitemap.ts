import type { MetadataRoute } from "next";
import { defaultLocale, type Locale, locales } from "@/i18n/config";
import type { StaticPathname } from "@/i18n/routing";
import { LEGAL_UPDATED_AT } from "@/lib/legal";
import { getGlobal, getGuides, getPlaces } from "@/lib/queries";
import { absoluteUrl, type Href, mediaUrl } from "@/lib/seo";
import type { Media } from "@/payload-types";

type Photo = number | Media | null | undefined;

interface PageEntry {
  href: Href;
  updatedAt: (string | null | undefined)[];
  images: Photo[];
}

function latest(dates: (string | null | undefined)[]) {
  const times = dates
    .filter((date): date is string => Boolean(date))
    .map((date) => new Date(date).getTime());

  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

function localized({ href, updatedAt, images }: PageEntry) {
  const languages = {
    ...Object.fromEntries(
      locales.map((locale) => [locale, absoluteUrl(href, locale)]),
    ),
    "x-default": absoluteUrl(href, defaultLocale),
  };
  const imageUrls = [
    ...new Set(images.map(mediaUrl).filter((url) => url !== undefined)),
  ];

  return locales.map((locale: Locale) => ({
    url: absoluteUrl(href, locale),
    lastModified: latest(updatedAt),
    alternates: { languages },
    images: imageUrls.length > 0 ? imageUrls : undefined,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [home, cottage, surroundings, rates, contact, places, guides] =
    await Promise.all([
      getGlobal("home-page", defaultLocale),
      getGlobal("cottage-page", defaultLocale),
      getGlobal("surroundings-page", defaultLocale),
      getGlobal("rates-page", defaultLocale),
      getGlobal("contact-page", defaultLocale),
      getPlaces(defaultLocale),
      getGuides(defaultLocale),
    ]);

  const guideDates = guides.map((guide) => guide.updatedAt);
  const pages: Record<StaticPathname, Omit<PageEntry, "href">> = {
    "/": {
      updatedAt: [home.updatedAt],
      images: [home.image, home.meta?.image],
    },
    "/le-gite": {
      updatedAt: [cottage.updatedAt],
      images: [
        ...(cottage.rooms ?? []).flatMap((room) =>
          (room.photos ?? []).map((photo) => photo.image),
        ),
        ...(cottage.gallery ?? []).map((photo) => photo.image),
      ],
    },
    "/les-alentours": {
      updatedAt: [
        surroundings.updatedAt,
        ...places.map((place) => place.updatedAt),
      ],
      images: [surroundings.meta?.image],
    },
    "/guides": {
      updatedAt: guideDates,
      images: guides.map((guide) => guide.image),
    },
    "/tarifs-reservation": {
      updatedAt: [rates.updatedAt],
      images: [rates.meta?.image],
    },
    "/contact": {
      updatedAt: [contact.updatedAt],
      images: [contact.meta?.image],
    },
    "/mentions-legales": { updatedAt: [LEGAL_UPDATED_AT], images: [] },
    "/confidentialite": { updatedAt: [LEGAL_UPDATED_AT], images: [] },
  };

  return [
    ...Object.entries(pages).flatMap(([href, page]) =>
      localized({ href: href as StaticPathname, ...page }),
    ),
    ...guides.flatMap((guide) =>
      localized({
        href: { pathname: "/guides/[slug]", params: { slug: guide.slug } },
        updatedAt: [guide.updatedAt],
        images: [guide.image],
      }),
    ),
  ];
}
