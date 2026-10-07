import { createHash } from "node:crypto";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { bearingFrom, formatDrive, type GeoPoint } from "@/lib/places";
import { formatRating, platformName, ratedPlatforms } from "@/lib/platforms";
import {
  asMedia,
  getGlobal,
  getGuideBySlug,
  getGuides,
  getPlaces,
  populated,
} from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";
import type { Guide, Media, Place } from "@/payload-types";
import {
  SHARE_TEMPLATE_VERSION,
  type ShareImage,
  type SharePage,
  type SharePanel,
  type ShareTarget,
  shareImagePath,
} from "./spec";

type MediaReference = number | Media | null | undefined;
type ShareTranslator = Awaited<ReturnType<typeof getTranslations<"share">>>;

export interface ShareContent {
  title: string;
  proof: string | null;
  photo: Media | null;
  alt: string;
  panel: SharePanel | null;
}

const HOME_COMMUNE = "romorantin";
const GENERIC_PLACE_WORDS = new Set([
  "chateau",
  "domaine",
  "maison",
  "musee",
  "sologne",
  "loire",
  "touraine",
  "france",
  "etang",
  "etangs",
  "foret",
  "forets",
  "vignoble",
  "vignobles",
  "caves",
  "croisiere",
]);
const SHOWN_PLATFORMS = 2;
const ROSE_MINUTES = 90;
const ROSE_LABELLED_RINGS = [30, 60, 90];
const PAGE_GLOBALS = {
  home: "home-page",
  cottage: "cottage-page",
  surroundings: "surroundings-page",
  guides: "guides-page",
  rates: "rates-page",
  contact: "contact-page",
} as const satisfies Record<SharePage, string>;

function firstPhoto(...candidates: MediaReference[]) {
  return candidates.map(asMedia).find((media) => media?.url) ?? null;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function properNouns(place: Place) {
  const words = `${place.commune ?? ""} ${place.name}`.match(
    /\p{Lu}[\p{L}]{4,}(?:-\p{Lu}[\p{L}]+)*/gu,
  );

  return (words ?? [])
    .map(normalize)
    .filter(
      (word) =>
        !GENERIC_PLACE_WORDS.has(word) && !word.startsWith(HOME_COMMUNE),
    );
}

function namedPlace(title: string, places: Place[]) {
  const titleWords = new Set(normalize(title).split(/[^a-z0-9-]+/));

  return places.find((place) =>
    properNouns(place).some((word) => titleWords.has(word)),
  );
}

async function gitePosition(locale: Locale): Promise<GeoPoint | null> {
  const { lat, lng } =
    (await getGlobal("site-settings", locale)).contact?.coordinates ?? {};

  return typeof lat === "number" && typeof lng === "number"
    ? { lat, lng }
    : null;
}

function rosePosition(origin: GeoPoint, place: Place) {
  const bearing = bearingFrom(origin, place);
  const reach = Math.min(place.driveMin, ROSE_MINUTES) / ROSE_MINUTES;

  return { x: reach * Math.sin(bearing), y: -reach * Math.cos(bearing) };
}

function rosePanel(
  origin: GeoPoint | null,
  places: Place[],
  highlighted: Place[],
  subject: Place | undefined,
  t: ShareTranslator,
): SharePanel | null {
  if (!origin || places.length === 0) return null;

  const highlightedIds = new Set(highlighted.map((place) => place.id));

  return {
    kind: "rose",
    points: places.map((place) => ({
      ...rosePosition(origin, place),
      category: place.category,
      highlighted: highlightedIds.has(place.id),
    })),
    ringLabels: ROSE_LABELLED_RINGS.map(formatDrive),
    caption: t("rose.caption"),
    count: t("rose.count", { count: places.length }),
    subject: subject && {
      ...rosePosition(origin, subject),
      label: formatDrive(subject.driveMin),
    },
  };
}

function guideSubject(title: string, places: Place[]) {
  return places.length === 1 ? places[0] : namedPlace(title, places);
}

function driveProof(title: string, places: Place[], t: ShareTranslator) {
  if (places.length === 0) return null;

  const subject = guideSubject(title, places);
  if (subject)
    return t("guide.single", { drive: formatDrive(subject.driveMin) });

  const minutes = places.map((place) => place.driveMin);

  return t("guide.range", {
    count: places.length,
    min: formatDrive(Math.min(...minutes)),
    max: formatDrive(Math.max(...minutes)),
  });
}

function shortTitle(title: string) {
  const [lead] = title.split(/\s*[:?]\s/);

  return (lead || title).replace(/\s*\?$/, "").trim();
}

async function pageProof(page: SharePage, locale: Locale, t: ShareTranslator) {
  if (page === "surroundings") {
    const places = await getPlaces(locale);
    if (places.length === 0) return null;

    const minutes = places.map((place) => place.driveMin);

    return t("surroundings.proof", {
      count: places.length,
      min: formatDrive(Math.min(...minutes)),
      max: formatDrive(Math.max(...minutes)),
    });
  }

  if (page === "guides") {
    const guides = await getGuides(locale);

    return guides.length > 0
      ? t("guides.proof", { count: guides.length })
      : null;
  }

  const settings = await getGlobal("site-settings", locale);

  if (page === "rates") {
    const ratings = ratedPlatforms(settings)
      .slice(0, SHOWN_PLATFORMS)
      .map(
        (platform) =>
          `${platformName(platform)} ${formatRating(platform.rating ?? 0, locale)}/${platform.ratingScale ?? 5}`,
      );

    return ratings.length > 0 ? ratings.join(", ") : null;
  }

  if (page === "contact") {
    const city = settings.contact?.city;

    return city ? t("contact.proof", { city }) : null;
  }

  const { maxGuests, surface, bedrooms, bathrooms } =
    settings.propertyDetails ?? {};

  if (page === "home") {
    return maxGuests && surface
      ? t("home.proof", { guests: maxGuests, surface })
      : null;
  }

  return bedrooms && bathrooms
    ? t("cottage.proof", { bedrooms, bathrooms })
    : null;
}

async function pagePanel(
  page: SharePage,
  locale: Locale,
  t: ShareTranslator,
): Promise<SharePanel | null> {
  const settings = await getGlobal("site-settings", locale);

  if (page === "cottage") {
    const facts = await getTranslations({
      locale,
      namespace: "cottage.facts",
    });
    const { surface, maxGuests, bedrooms, bathrooms } =
      settings.propertyDetails ?? {};
    const figures = [
      { value: surface, label: facts("surface") },
      { value: maxGuests, label: facts("guests", { count: maxGuests ?? 0 }) },
      { value: bedrooms, label: facts("bedrooms", { count: bedrooms ?? 0 }) },
      {
        value: bathrooms,
        label: facts("bathrooms", { count: bathrooms ?? 0 }),
      },
    ].flatMap(({ value, label }) =>
      value ? [{ value: String(value), label }] : [],
    );

    return figures.length > 0 ? { kind: "figures", figures } : null;
  }

  if (page === "rates") {
    const figures = ratedPlatforms(settings)
      .slice(0, SHOWN_PLATFORMS)
      .map((platform) => ({
        value: formatRating(platform.rating ?? 0, locale),
        label: t("rates.figure", {
          scale: platform.ratingScale ?? 5,
          platform: platformName(platform),
        }),
      }));

    if (figures.length > 0) return { kind: "figures", figures };
  }

  const places = await getPlaces(locale);

  return rosePanel(
    await gitePosition(locale),
    places,
    places.filter((place) => place.featured),
    undefined,
    t,
  );
}

async function pagePhoto(page: SharePage, locale: Locale) {
  const home = () => getGlobal("home-page", locale);

  if (page === "home") {
    const global = await home();

    return firstPhoto(global.meta?.image, global.image);
  }

  if (page === "guides") {
    const guides = await getGuides(locale);
    const [lead] = [...guides].sort(
      (a, b) => (b.places?.length ?? 0) - (a.places?.length ?? 0),
    );

    return firstPhoto(
      (await getGlobal("guides-page", locale)).meta?.image,
      lead?.image,
      guides.find((guide) => guide.image)?.image,
      (await home()).image,
    );
  }

  if (page === "cottage") {
    const global = await getGlobal("cottage-page", locale);

    return firstPhoto(
      global.meta?.image,
      global.image,
      global.rooms?.[0]?.photos?.[0]?.image,
      (await home()).image,
    );
  }

  const global = await getGlobal(
    page === "surroundings"
      ? "surroundings-page"
      : page === "rates"
        ? "rates-page"
        : "contact-page",
    locale,
  );

  return firstPhoto(global.meta?.image, global.image, (await home()).image);
}

function describe(title: string, photo: Media | null, siteName: string) {
  return photo?.alt ? `${title}. ${photo.alt}` : `${title}, ${siteName}`;
}

async function pageContent(
  page: SharePage,
  locale: Locale,
): Promise<ShareContent> {
  const [t, common] = await Promise.all([
    getTranslations({ locale, namespace: "share" }),
    getTranslations({ locale, namespace: "common" }),
  ]);
  const [proof, photo, panel, global] = await Promise.all([
    pageProof(page, locale, t),
    pagePhoto(page, locale),
    pagePanel(page, locale, t),
    getGlobal(PAGE_GLOBALS[page], locale),
  ]);
  const title = global.meta?.shareTitle || shortTitle(global.title);

  return {
    title,
    proof,
    photo,
    panel,
    alt: describe(title, photo, common("siteName")),
  };
}

async function guideContent(
  guide: Guide,
  locale: Locale,
): Promise<ShareContent> {
  const [t, common, allPlaces, home, origin] = await Promise.all([
    getTranslations({ locale, namespace: "share" }),
    getTranslations({ locale, namespace: "common" }),
    getPlaces(locale),
    getGlobal("home-page", locale),
    gitePosition(locale),
  ]);
  const cited = populated<Place>(guide.places);
  const citedIds = new Set(cited.map((place) => place.id));
  const citedPhotos = allPlaces
    .filter((place) => citedIds.has(place.id))
    .map((place) => place.image);
  const title = guide.meta?.shareTitle || shortTitle(guide.title);
  const photo = firstPhoto(
    guide.meta?.image,
    guide.image,
    ...citedPhotos,
    home.image,
  );

  return {
    title,
    proof: driveProof(title, cited, t),
    photo,
    panel: rosePanel(origin, allPlaces, cited, guideSubject(title, cited), t),
    alt: describe(title, photo, common("siteName")),
  };
}

export async function shareContent(
  target: ShareTarget,
  locale: Locale,
): Promise<ShareContent | null> {
  if (target.kind === "page") return pageContent(target.page, locale);

  const guide = await getGuideBySlug(target.slug, locale);

  return guide ? guideContent(guide, locale) : null;
}

function contentVersion({ title, proof, photo, panel }: ShareContent) {
  const fingerprint = JSON.stringify([
    SHARE_TEMPLATE_VERSION,
    title,
    proof,
    photo?.filename,
    photo?.updatedAt,
    photo?.focalX,
    photo?.focalY,
    panel,
  ]);

  return createHash("sha1").update(fingerprint).digest("hex").slice(0, 10);
}

function toShareImage(
  content: ShareContent,
  target: ShareTarget,
  locale: Locale,
): ShareImage {
  return {
    url: `${SITE_URL}${shareImagePath(locale, target)}?v=${contentVersion(content)}`,
    alt: content.alt,
  };
}

export async function pageShareImage(page: SharePage, locale: Locale) {
  const target: ShareTarget = { kind: "page", page };

  return toShareImage(await pageContent(page, locale), target, locale);
}

export async function guideShareImage(guide: Guide, locale: Locale) {
  const target: ShareTarget = { kind: "guide", slug: guide.slug };

  return toShareImage(await guideContent(guide, locale), target, locale);
}
