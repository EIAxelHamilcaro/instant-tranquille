import { unstable_cache } from "next/cache";
import { PAGE_GLOBAL_SLUGS } from "@/globals/pages/page-global";
import { todayInParis } from "@/lib/availability/ical";
import { overallRating } from "@/lib/jsonld";
import { getPayload } from "@/lib/payload";
import { PLACE_CATEGORY_OPTIONS } from "@/lib/place-categories";
import type { RosePlace } from "@/lib/places";
import { platformName, ratedPlatforms } from "@/lib/platforms";
import type { SiteSetting } from "@/payload-types";

const FIVE_MINUTES = 300;
const DAY_MS = 86_400_000;
const MONTHS = 12;
const LATEST_MESSAGES = 3;

export const GUIDE_CHECK_MAX_AGE_DAYS = 180;

export const ADMIN_PAGES = [
  { slug: "home-page", label: "Accueil", path: "/" },
  { slug: "cottage-page", label: "Le gîte", path: "/le-gite" },
  { slug: "surroundings-page", label: "Les alentours", path: "/les-alentours" },
  { slug: "guides-page", label: "Guides", path: "/guides" },
  { slug: "rates-page", label: "Tarifs", path: "/tarifs-reservation" },
  { slug: "contact-page", label: "Contact", path: "/contact" },
] as const satisfies readonly {
  slug: (typeof PAGE_GLOBAL_SLUGS)[number];
  label: string;
  path: string;
}[];

const REVIEW_SOURCES = {
  airbnb: "Airbnb",
  booking: "Booking.com",
  google: "Google",
  direct: "En direct",
} as const;

type ReviewSource = keyof typeof REVIEW_SOURCES;

const missing = (field: string) => ({
  or: [{ [field]: { exists: false } }, { [field]: { equals: "" } }],
});

const relationId = (value: unknown) =>
  typeof value === "object" && value !== null && "id" in value
    ? Number(value.id)
    : typeof value === "number"
      ? value
      : null;

function lastMonths(now: Date) {
  const [year = 0, month = 1] = todayInParis(now).split("-").map(Number);

  return Array.from({ length: MONTHS }, (_, index) =>
    new Date(Date.UTC(year, month - MONTHS + index, 1))
      .toISOString()
      .slice(0, 7),
  );
}

export const getUnreadMessages = unstable_cache(
  async () => {
    const payload = await getPayload();
    const { totalDocs } = await payload.count({
      collection: "contact-messages",
      where: { readStatus: { not_equals: true } },
    });

    return totalDocs;
  },
  ["admin-unread-messages"],
  { revalidate: FIVE_MINUTES, tags: ["contact-messages"] },
);

export const getAdminStats = unstable_cache(
  async () => {
    const payload = await getPayload();
    const now = new Date();
    const months = lastMonths(now);
    const since = new Date(`${months[0]}-01T00:00:00Z`).getTime() - DAY_MS;
    const staleBefore = new Date(
      now.getTime() - GUIDE_CHECK_MAX_AGE_DAYS * DAY_MS,
    ).toISOString();

    const [
      messages,
      latestMessages,
      reviews,
      places,
      placesWithoutEnglish,
      guides,
      guidesWithoutEnglish,
      photosWithoutCredit,
      pricing,
      settings,
      ...englishPages
    ] = await Promise.all([
      payload.find({
        collection: "contact-messages",
        depth: 0,
        pagination: false,
        select: { createdAt: true },
        where: { createdAt: { greater_than: new Date(since).toISOString() } },
      }),
      payload.find({
        collection: "contact-messages",
        depth: 0,
        limit: LATEST_MESSAGES,
        sort: "-createdAt",
        select: {
          subject: true,
          name: true,
          createdAt: true,
          readStatus: true,
        },
      }),
      payload.find({
        collection: "testimonials",
        depth: 0,
        pagination: false,
        select: { source: true, status: true, createdAt: true },
      }),
      payload.find({
        collection: "places",
        depth: 0,
        pagination: false,
        select: {
          name: true,
          commune: true,
          category: true,
          image: true,
          lat: true,
          lng: true,
          driveMin: true,
          driveKm: true,
          featured: true,
        },
      }),
      payload.count({
        collection: "places",
        locale: "en",
        where: missing("name"),
      }),
      payload.find({
        collection: "guides",
        depth: 0,
        pagination: false,
        select: { title: true, checkedAt: true, _status: true },
      }),
      payload.count({
        collection: "guides",
        locale: "en",
        where: {
          and: [{ _status: { equals: "published" } }, missing("title")],
        },
      }),
      payload.find({
        collection: "media",
        depth: 0,
        pagination: false,
        select: {},
        where: missing("credit"),
      }),
      payload.findGlobal({
        slug: "pricing-config",
        depth: 0,
        select: { nightlyRates: true },
      }),
      payload.findGlobal({
        slug: "site-settings",
        depth: 0,
        select: {
          platforms: true,
          propertyDetails: true,
          calendars: true,
          hosts: true,
          contact: true,
        },
      }),
      ...ADMIN_PAGES.map(({ slug }) =>
        payload.findGlobal({
          slug,
          locale: "en",
          fallbackLocale: false,
          depth: 0,
          select: { title: true },
        }),
      ),
    ]);

    const perMonth = new Map(months.map((month) => [month, 0]));
    for (const { createdAt } of messages.docs) {
      const month = todayInParis(new Date(createdAt)).slice(0, 7);
      if (perMonth.has(month))
        perMonth.set(month, (perMonth.get(month) ?? 0) + 1);
    }

    const approved = reviews.docs.filter(
      (review) => review.status === "approved",
    );
    const sources = Object.keys(REVIEW_SOURCES) as ReviewSource[];
    const uncredited = new Set(
      photosWithoutCredit.docs.map((photo) => photo.id),
    );
    const placePhotos = places.docs.map((place) => relationId(place.image));
    const ratings = settings as SiteSetting;
    const published = guides.docs.filter(
      (guide) => guide._status === "published",
    );
    const stale = published
      .filter((guide) => !guide.checkedAt || guide.checkedAt < staleBefore)
      .sort((a, b) => (a.checkedAt ?? "").localeCompare(b.checkedAt ?? ""));
    const oldest = stale[0];

    return {
      messages: {
        months: months.map((month) => ({
          month,
          count: perMonth.get(month) ?? 0,
        })),
        latest: latestMessages.docs.map((message) => ({
          id: message.id,
          subject: message.subject,
          name: message.name,
          createdAt: message.createdAt,
          isRead: Boolean(message.readStatus),
        })),
      },
      reviews: {
        approved: approved.length,
        pending: reviews.docs.filter((review) => review.status === "pending")
          .length,
        latestAt:
          approved
            .map((review) => review.createdAt)
            .sort()
            .at(-1) ?? null,
        bySource: sources
          .map((source) => ({
            source,
            label: REVIEW_SOURCES[source],
            count: approved.filter((review) => review.source === source).length,
          }))
          .filter(({ count }) => count > 0),
      },
      platforms: {
        overall: overallRating(ratings),
        rated: ratedPlatforms(ratings).map((platform) => ({
          source: platform.platform,
          name: platformName(platform),
          rating: platform.rating ?? 0,
          scale: platform.ratingScale || 5,
          reviewCount: platform.reviewCount ?? 0,
        })),
      },
      places: {
        total: places.docs.length,
        withoutPhoto: placePhotos.filter((photo) => photo === null).length,
        withoutEnglish: placesWithoutEnglish.totalDocs,
        byCategory: PLACE_CATEGORY_OPTIONS.map(({ value, label }) => ({
          category: value,
          label: label.replace(/ \(.*\)$/, ""),
          count: places.docs.filter((place) => place.category === value).length,
        })).filter(({ count }) => count > 0),
      },
      guides: {
        published: published.length,
        drafts: guides.docs.length - published.length,
        withoutEnglish: guidesWithoutEnglish.totalDocs,
        stale: stale.length,
        staleBefore,
        oldest: oldest
          ? {
              id: oldest.id,
              title: oldest.title,
              checkedAt: oldest.checkedAt ?? null,
            }
          : null,
      },
      photos: {
        placePhotosWithoutCredit: [
          ...new Set(
            placePhotos.filter(
              (photo): photo is number =>
                photo !== null && uncredited.has(photo),
            ),
          ),
        ],
      },
      pricing: { rates: pricing.nightlyRates?.length ?? 0 },
      pagesWithoutEnglish: ADMIN_PAGES.filter(
        (_, index) => !englishPages[index]?.title,
      ).map(({ slug, label }) => ({ slug, label })),
      facts: settings.propertyDetails ?? null,
      hosts: settings.hosts ?? "",
      origin: {
        lat: settings.contact?.coordinates?.lat ?? null,
        lng: settings.contact?.coordinates?.lng ?? null,
      },
      rose: places.docs.map(
        (place): RosePlace => ({
          id: String(place.id),
          name: place.name,
          commune: place.commune,
          category: place.category,
          lat: place.lat,
          lng: place.lng,
          driveMin: place.driveMin,
          driveKm: place.driveKm,
          featured: place.featured,
        }),
      ),
      hasCalendars: Boolean(
        settings.calendars?.airbnb || settings.calendars?.booking,
      ),
    };
  },
  ["admin-stats"],
  {
    revalidate: FIVE_MINUTES,
    tags: [
      "contact-messages",
      "testimonials",
      "places",
      "guides",
      "media",
      "pricing-config",
      "site-settings",
      ...PAGE_GLOBAL_SLUGS,
    ],
  },
);

export type AdminStats = Awaited<ReturnType<typeof getAdminStats>>;
