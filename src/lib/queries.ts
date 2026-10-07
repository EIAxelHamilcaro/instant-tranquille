import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import type { CollectionSlug, GlobalSlug, Where } from "payload";
import type { Locale } from "@/i18n/config";
import type { RosePlace } from "@/lib/places";
import type { RedirectRule } from "@/lib/redirects";
import type { Config, Media, Place } from "@/payload-types";
import { getPayload } from "./payload";

type Globals = Config["globals"];
type Collections = Config["collections"];

const ONE_DAY = 86400;
const EMBEDDED_TAGS = ["media", "guides", "places", "official-sites"];

const PRIVATE_FIELDS = ["calendars"];

const withoutPrivateFields = <Doc extends object>(doc: Doc) =>
  Object.fromEntries(
    Object.entries(doc).filter(([name]) => !PRIVATE_FIELDS.includes(name)),
  ) as Doc;

async function isDraft() {
  const { isEnabled } = await draftMode();
  return isEnabled;
}

export async function getGlobal<Slug extends GlobalSlug>(
  slug: Slug,
  locale: Locale,
): Promise<Globals[Slug]> {
  const load = async (draft: boolean) => {
    const payload = await getPayload();
    const global = await payload.findGlobal({ slug, locale, draft, depth: 2 });

    return withoutPrivateFields(global);
  };

  if (await isDraft()) return load(true) as Promise<Globals[Slug]>;

  return unstable_cache(() => load(false), [slug, locale], {
    revalidate: ONE_DAY,
    tags: [slug, ...EMBEDDED_TAGS],
  })() as Promise<Globals[Slug]>;
}

interface FindOptions {
  where?: Where;
  sort?: string | string[];
  limit?: number;
  depth?: number;
}

async function findDocs<Slug extends CollectionSlug>(
  collection: Slug,
  locale: Locale,
  cacheKey: string,
  { where, sort, limit = 200, depth = 1 }: FindOptions = {},
): Promise<Collections[Slug][]> {
  const load = async (draft: boolean) => {
    const payload = await getPayload();
    const result = await payload.find({
      collection,
      locale,
      draft,
      where,
      sort,
      limit,
      depth,
      overrideAccess: draft,
    });

    return result.docs;
  };

  if (await isDraft()) return load(true) as Promise<Collections[Slug][]>;

  const keyParts = [collection, cacheKey, locale, `depth:${depth}`];

  return unstable_cache(() => load(false), keyParts, {
    revalidate: ONE_DAY,
    tags: [collection, ...EMBEDDED_TAGS],
  })() as Promise<Collections[Slug][]>;
}

export const getPlaces = (locale: Locale) =>
  findDocs("places", locale, "all-with-photo", { sort: "driveMin", depth: 1 });

export const getAmenities = (locale: Locale) =>
  findDocs("amenities", locale, "enabled", {
    where: { enabled: { not_equals: false } },
    sort: "order",
    depth: 0,
  });

export const getReviews = (locale: Locale) =>
  findDocs("testimonials", locale, "approved-featured-first", {
    where: { status: { equals: "approved" } },
    sort: ["-featured", "createdAt"],
    depth: 0,
  });

export const getOfficialSites = (locale: Locale) =>
  findDocs("official-sites", locale, "all-by-order", {
    sort: ["order", "id"],
    depth: 0,
  });

export const getGuides = (locale: Locale) =>
  findDocs("guides", locale, "published", {
    where: { _status: { equals: "published" } },
    sort: "title",
    depth: 1,
  });

export async function getGuideBySlug(slug: string, locale: Locale) {
  const [guide] = await findDocs("guides", locale, `slug:${slug}`, {
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });

  return guide ?? null;
}

export function toRosePlace(place: Place): RosePlace {
  const image = asMedia(place.image);

  return {
    commune: place.commune,
    photo: image?.url
      ? {
          url: image.url,
          alt: image.alt,
          blurDataURL: image.blurDataURL,
          position: `${image.focalX ?? 50}% ${image.focalY ?? 50}%`,
        }
      : null,
    id: String(place.id),
    name: place.name,
    category: place.category,
    lat: place.lat,
    lng: place.lng,
    driveMin: place.driveMin,
    driveKm: place.driveKm,
    summary: place.summary,
    featured: place.featured,
  };
}

export function asMedia(value: number | Media | null | undefined) {
  return typeof value === "object" && value !== null ? value : null;
}

export function populated<Doc extends { id: number }>(
  values: (number | Doc)[] | null | undefined,
): Doc[] {
  return (values ?? []).filter(
    (value): value is Doc => typeof value === "object" && value !== null,
  );
}

export async function getPublishedGuideSlugs() {
  const payload = await getPayload();
  const { docs } = await payload.find({
    collection: "guides",
    where: { _status: { equals: "published" } },
    select: { slug: true },
    pagination: false,
    depth: 0,
  });

  return docs.map((guide) => guide.slug);
}

export const getRedirectRules = unstable_cache(
  async (): Promise<RedirectRule[]> => {
    const payload = await getPayload();
    const { docs } = await payload.find({
      collection: "redirects",
      pagination: false,
      depth: 1,
      select: { from: true, to: true },
    });

    return docs.flatMap(({ from, to }): RedirectRule[] => {
      if (to?.type === "custom") {
        return to.url ? [{ from, to: { kind: "address", url: to.url } }] : [];
      }

      const guide = to?.reference?.value;

      return typeof guide === "object" && guide?._status === "published"
        ? [{ from, to: { kind: "guide", slug: guide.slug } }]
        : [];
    });
  },
  ["redirect-rules"],
  { revalidate: ONE_DAY, tags: ["redirects", "guides"] },
);
