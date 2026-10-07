import type { Payload } from "payload";
import { THEME_OFFICIAL_SITES } from "./content/official-sites";
import {
  CONTACT_PAGE,
  COTTAGE_PAGE,
  GUIDES_PAGE,
  HOME_PAGE,
  RATES_PAGE,
  SURROUNDINGS_PAGE,
} from "./content/pages";
import { fillGlobal } from "./fill";
import type { GuideIds } from "./guides";
import type { MediaIds } from "./media";
import type { OfficialSiteIds } from "./official-sites";
import type { PlaceIds } from "./places";
import { richText } from "./rich-text";

interface SeedPagesContext {
  media: MediaIds;
  guides: GuideIds;
  places: PlaceIds;
  sites: OfficialSiteIds;
}

const HOME_PLACES = [
  "chambord",
  "beauval",
  "cheverny",
  "parc-equestre-federal",
];

const LOCALES = ["fr", "en"] as const;

const HEADER_PHOTOS = {
  "cottage-page": "sejour-canape-buffet-escalier",
  "surroundings-page": "chambord",
  "rates-page": "chambre-2-lit-double-sous-pente-terracotta",
  "contact-page": "entree-commode-deco-briques",
} as const;

export async function seedPages(
  payload: Payload,
  { media, guides, places, sites }: SeedPagesContext,
) {
  const photos = (keys: readonly string[]) =>
    keys.flatMap((key) => (media[key] ? [{ image: media[key] }] : []));
  const ids = (keys: readonly string[], known: Record<string, number>) =>
    keys.flatMap((key) => (known[key] ? [known[key]] : []));

  for (const locale of LOCALES) {
    await fillGlobal(payload, "home-page", locale, {
      ...HOME_PAGE[locale],
      image: media[HOME_PAGE.image],
      featuredGuides: ids(HOME_PAGE.featuredGuides, guides),
      featuredPlaces: ids(HOME_PLACES, places),
    });
  }

  await fillGlobal(payload, "cottage-page", "fr", {
    title: COTTAGE_PAGE.fr.title,
    lede: COTTAGE_PAGE.fr.lede,
    meta: COTTAGE_PAGE.fr.meta,
    image: media[HEADER_PHOTOS["cottage-page"]],
    description: richText(COTTAGE_PAGE.fr.description),
    rooms: COTTAGE_PAGE.rooms.map((room) => ({
      name: room.fr.name,
      level: room.level,
      details: room.fr.details,
      description: room.fr.description,
      photos: photos(room.photos),
    })),
    gallery: photos(COTTAGE_PAGE.gallery),
  });
  const cottage = await payload.findGlobal({
    slug: "cottage-page",
    locale: "en",
    fallbackLocale: false,
    depth: 0,
  });
  const hasEnglishRooms = cottage.rooms?.every((room) => room.name);
  await fillGlobal(payload, "cottage-page", "en", {
    title: COTTAGE_PAGE.en.title,
    lede: COTTAGE_PAGE.en.lede,
    meta: COTTAGE_PAGE.en.meta,
    description: richText(COTTAGE_PAGE.en.description),
  });
  if (!hasEnglishRooms) {
    await payload.updateGlobal({
      slug: "cottage-page",
      locale: "en",
      data: {
        rooms: cottage.rooms?.map((room, index) => ({
          id: room.id,
          level: room.level,
          photos: room.photos,
          name: COTTAGE_PAGE.rooms[index]?.en.name ?? "",
          details: COTTAGE_PAGE.rooms[index]?.en.details,
          description: COTTAGE_PAGE.rooms[index]?.en.description,
        })),
        _status: "published",
      },
    });
    console.log("cottage-page (en) rooms translated");
  }

  for (const locale of LOCALES) {
    const text = SURROUNDINGS_PAGE[locale];
    await fillGlobal(payload, "surroundings-page", locale, {
      title: text.title,
      lede: text.lede,
      meta: text.meta,
      image: media[HEADER_PHOTOS["surroundings-page"]],
      intro: richText(text.intro),
      headings: text.headings,
      equestrianTitle: text.equestrianTitle,
      equestrianText: richText(text.equestrianText),
    });
  }

  for (const locale of LOCALES) {
    await fillGlobal(payload, "guides-page", locale, {
      ...GUIDES_PAGE[locale],
      themeSites: Object.fromEntries(
        Object.entries(THEME_OFFICIAL_SITES).map(([theme, keys]) => [
          theme,
          ids(keys, sites),
        ]),
      ),
    });
  }

  await fillGlobal(payload, "rates-page", "fr", {
    title: RATES_PAGE.fr.title,
    lede: RATES_PAGE.fr.lede,
    meta: RATES_PAGE.fr.meta,
    image: media[HEADER_PHOTOS["rates-page"]],
    stepsTitle: RATES_PAGE.fr.stepsTitle,
    steps: RATES_PAGE.fr.steps,
    directBooking: richText(RATES_PAGE.fr.directBooking),
  });
  const rates = await payload.findGlobal({
    slug: "rates-page",
    locale: "en",
    fallbackLocale: false,
    depth: 0,
  });
  const hasEnglishSteps = rates.steps?.every((step) => step.title);
  await fillGlobal(payload, "rates-page", "en", {
    title: RATES_PAGE.en.title,
    lede: RATES_PAGE.en.lede,
    meta: RATES_PAGE.en.meta,
    stepsTitle: RATES_PAGE.en.stepsTitle,
    directBooking: richText(RATES_PAGE.en.directBooking),
  });
  if (!hasEnglishSteps) {
    await payload.updateGlobal({
      slug: "rates-page",
      locale: "en",
      data: {
        steps: rates.steps?.map((step, index) => ({
          id: step.id,
          title: RATES_PAGE.en.steps[index]?.title ?? "",
          text: RATES_PAGE.en.steps[index]?.text ?? "",
        })),
        _status: "published",
      },
    });
    console.log("rates-page (en) steps translated");
  }

  for (const locale of LOCALES) {
    await fillGlobal(payload, "contact-page", locale, {
      ...CONTACT_PAGE[locale],
      image: media[HEADER_PHOTOS["contact-page"]],
    });
  }
}
