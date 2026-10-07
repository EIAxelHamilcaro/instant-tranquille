import { type Locale, locales } from "@/i18n/config";
import { nightlyRange, nightlyRates, ratedPlatforms } from "@/lib/platforms";
import {
  absoluteUrl,
  type Href,
  mediaUrl,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import {
  FILM_PUBLISHED_ON,
  FILM_SPOKEN_LOCALE,
  type FilmSources,
} from "@/lib/videos";
import type {
  Amenity,
  CottagePage,
  Guide,
  Place,
  PricingConfig,
  SiteSetting,
  Testimonial,
} from "@/payload-types";

const COTTAGE_ID = `${SITE_URL}/#gite`;
const WEBSITE_ID = `${SITE_URL}/#site`;

const LOGO_URL = `${SITE_URL}/icons/icon-512.png`;
const LOGO_SIZE = 512;

export const cottageReference = { "@id": COTTAGE_ID };

const cottageLogo = {
  "@type": "ImageObject",
  url: LOGO_URL,
  width: LOGO_SIZE,
  height: LOGO_SIZE,
};

const namedCottage = { ...cottageReference, name: SITE_NAME };

const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value !== "object") return false;

  return Object.keys(value).every((key) => key === "@type");
};

export function withoutEmpty<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(withoutEmpty).filter((item) => !isEmpty(item)) as T;
  }
  if (value === null || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, withoutEmpty(item)])
      .filter(([, item]) => !isEmpty(item)),
  ) as T;
}

export function lexicalToText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const { text, children, root } = node as {
    text?: unknown;
    children?: unknown[];
    root?: unknown;
  };

  if (typeof text === "string") return text;
  if (root) return lexicalToText(root);
  if (!Array.isArray(children)) return "";

  return children.map(lexicalToText).filter(Boolean).join(" ").trim();
}

function toSchemaTime(value: string | null | undefined) {
  const match = value?.match(/(\d{1,2})\s*[h:]\s*(\d{2})?/i);
  if (!match?.[1]) return undefined;

  return `${match[1].padStart(2, "0")}:${match[2] ?? "00"}:00`;
}

function priceRange(pricing: PricingConfig, locale: Locale) {
  const range = nightlyRange(nightlyRates(pricing));
  if (!range) return undefined;

  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: pricing.currency || "EUR",
    maximumFractionDigits: 0,
  });

  return `${format.format(range.min)} - ${format.format(range.max)}`;
}

export function overallRating(settings: SiteSetting) {
  const platforms = ratedPlatforms(settings);
  const reviewCount = platforms.reduce(
    (total, platform) => total + (platform.reviewCount ?? 0),
    0,
  );
  if (reviewCount === 0) return null;

  const weighted = platforms.reduce(
    (total, platform) =>
      total +
      ((platform.rating ?? 0) / (platform.ratingScale || 5)) *
        5 *
        (platform.reviewCount ?? 0),
    0,
  );

  return {
    ratingValue: Number((weighted / reviewCount).toFixed(1)),
    bestRating: 5,
    worstRating: 1,
    reviewCount,
  };
}

function aggregateRating(settings: SiteSetting) {
  const rating = overallRating(settings);

  return rating ? { "@type": "AggregateRating", ...rating } : undefined;
}

const BED_TYPES = [
  {
    typeOfBed: "Double",
    wording: /(\d+)\s+(?:lits?\s+doubles?|double\s+beds?)/i,
  },
  {
    typeOfBed: "Single",
    wording: /(\d+)\s+(?:lits?\s+simples?|single\s+beds?)/i,
  },
];

export function cottageBeds(cottage: CottagePage) {
  const details = (cottage.rooms ?? []).map((room) => room.details ?? "");

  return BED_TYPES.flatMap(({ typeOfBed, wording }) => {
    const numberOfBeds = details.reduce(
      (total, text) => total + Number(text.match(wording)?.[1] ?? 0),
      0,
    );

    return numberOfBeds > 0
      ? [{ "@type": "BedDetails", numberOfBeds, typeOfBed }]
      : [];
  });
}

export function cottageImages(cottage: CottagePage) {
  const photos = [
    ...(cottage.rooms ?? []).flatMap((room) =>
      (room.photos ?? []).map((photo) => photo.image),
    ),
    ...(cottage.gallery ?? []).map((item) => item.image),
  ];

  return [...new Set(photos.map(mediaUrl).filter(Boolean))];
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: [...locales],
    publisher: cottageReference,
  };
}

interface CottageJsonLdOptions {
  locale: Locale;
  settings: SiteSetting;
  pricing: PricingConfig;
  amenities: Amenity[];
  reviews: Testimonial[];
  cottage: CottagePage;
}

export function cottageJsonLd({
  locale,
  settings,
  pricing,
  amenities,
  reviews,
  cottage,
}: CottageJsonLdOptions) {
  const { contact, propertyDetails: property, socialLinks } = settings;
  const sameAs = [
    ...new Set(
      [
        ...(settings.platforms ?? []).map((platform) => platform.url),
        ...Object.values(socialLinks ?? {}),
      ].filter(
        (url): url is string => typeof url === "string" && url.length > 0,
      ),
    ),
  ];

  return withoutEmpty({
    "@context": "https://schema.org",
    "@type": ["VacationRental", "LodgingBusiness"],
    "@id": COTTAGE_ID,
    additionalType: "House",
    identifier: "linstant-tranquille-romorantin",
    name: SITE_NAME,
    description: settings.siteDescription,
    url: SITE_URL,
    logo: cottageLogo,
    image: cottageImages(cottage),
    telephone: contact?.phone,
    email: contact?.email,
    priceRange: priceRange(pricing, locale),
    currenciesAccepted: pricing.currency || "EUR",
    checkinTime: toSchemaTime(pricing.policies?.checkIn),
    checkoutTime: toSchemaTime(pricing.policies?.checkOut),
    petsAllowed: property?.petsAllowed ?? undefined,
    numberOfRooms: property?.bedrooms,
    knowsLanguage: ["fr", "en"],
    address: {
      "@type": "PostalAddress",
      streetAddress: contact?.address,
      postalCode: contact?.postalCode,
      addressLocality: contact?.city,
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
    geo: contact?.coordinates?.lat
      ? {
          "@type": "GeoCoordinates",
          latitude: contact.coordinates.lat,
          longitude: contact.coordinates.lng,
        }
      : undefined,
    latitude: contact?.coordinates?.lat,
    longitude: contact?.coordinates?.lng,
    containedInPlace: {
      "@type": "AdministrativeArea",
      name: "Sologne",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Loir-et-Cher",
      },
    },
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "EntirePlace",
      occupancy: {
        "@type": "QuantitativeValue",
        value: property?.maxGuests,
      },
      numberOfBedrooms: property?.bedrooms,
      bed: cottageBeds(cottage),
      numberOfBathroomsTotal: property?.bathrooms,
      floorSize: property?.surface
        ? {
            "@type": "QuantitativeValue",
            value: property.surface,
            unitCode: "MTK",
          }
        : undefined,
      amenityFeature: amenities.map((amenity) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity.name,
        value: true,
      })),
    },
    aggregateRating: aggregateRating(settings),
    review: reviews.slice(0, 10).map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.guestName },
      reviewBody: review.text,
      datePublished: (review.stayDate ?? review.createdAt).slice(0, 10),
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
      },
    })),
    sameAs,
  });
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqJsonLd(items: FaqItem[]) {
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: { name: string; href: Href }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, href: "/" as Href }]
      .concat(items)
      .map(({ name, href }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name,
        item: absoluteUrl(href, locale),
      })),
  };
}

export function placeNode(place: Place) {
  return {
    "@type":
      place.category === "chateaux"
        ? "LandmarksOrHistoricalBuildings"
        : "TouristAttraction",
    name: place.name,
    description: place.summary ?? undefined,
    sameAs: place.website ?? undefined,
    address: place.commune
      ? {
          "@type": "PostalAddress",
          addressLocality: place.commune,
          addressCountry: "FR",
        }
      : undefined,
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
  };
}

export function placesJsonLd(name: string, places: Place[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: placeNode(place),
    })),
  };
}

export function guideTripJsonLd(
  guide: Guide,
  steps: { time: string; title: string; details?: string | null }[],
  locale: Locale,
) {
  if (steps.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: guide.title,
    description: guide.excerpt,
    inLanguage: locale,
    url: absoluteUrl(
      { pathname: "/guides/[slug]", params: { slug: guide.slug } },
      locale,
    ),
    provider: cottageReference,
    itinerary: {
      "@type": "ItemList",
      numberOfItems: steps.length,
      itemListElement: steps.map((step, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${step.time} ${step.title}`,
        description: step.details ?? undefined,
      })),
    },
  };
}

export function guideJsonLd(
  guide: Guide,
  places: Place[],
  locale: Locale,
  wordCount: number,
) {
  const sources = (guide.sources ?? []).map(({ name, url }) => ({
    "@type": "WebPage",
    name,
    url,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt,
    inLanguage: locale,
    image: mediaUrl(guide.image),
    datePublished: guide.createdAt,
    dateModified: guide.updatedAt,
    wordCount,
    mainEntityOfPage: absoluteUrl(
      { pathname: "/guides/[slug]", params: { slug: guide.slug } },
      locale,
    ),
    author: namedCottage,
    publisher: { ...namedCottage, logo: cottageLogo },
    about: places.map(placeNode),
    citation: sources.length > 0 ? sources : undefined,
  };
}

export function guideListJsonLd(name: string, guides: Guide[], locale: Locale) {
  if (guides.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: absoluteUrl(
        { pathname: "/guides/[slug]", params: { slug: guide.slug } },
        locale,
      ),
    })),
  };
}

interface FilmJsonLdOptions {
  film: FilmSources;
  name: string;
  description: string;
}

export function filmJsonLd({ film, name, description }: FilmJsonLdOptions) {
  const { src, poster } = film.wide ?? film.master;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: poster ? `${SITE_URL}${poster}` : undefined,
    uploadDate: FILM_PUBLISHED_ON,
    duration: film.duration ? `PT${Math.round(film.duration)}S` : undefined,
    contentUrl: `${SITE_URL}${src}`,
    inLanguage: FILM_SPOKEN_LOCALE,
    about: cottageReference,
  };
}
