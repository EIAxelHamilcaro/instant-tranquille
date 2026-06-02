import type { CmsAmenity, CmsSeason, CmsTestimonial } from "./queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const BUSINESS_ID = `${SITE_URL}/#business`;

export function extractPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (typeof n.text === "string") return n.text;
  if (Array.isArray(n.children)) {
    return n.children.map(extractPlainText).join(" ");
  }
  if (n.root && typeof n.root === "object") {
    return extractPlainText(n.root);
  }
  return "";
}

function buildReviewFields(
  testimonials?: CmsTestimonial[],
): Record<string, unknown> {
  if (!testimonials || testimonials.length === 0) return {};
  return {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (
        testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
      ).toFixed(1),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.slice(0, 5).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.guestName },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.text,
      ...(t.stayDate && { datePublished: t.stayDate }),
    })),
  };
}

function buildPostalAddress(options?: {
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
}) {
  return {
    "@type": "PostalAddress",
    ...(options?.address && { streetAddress: options.address }),
    ...(options?.city && { addressLocality: options.city }),
    ...(options?.postalCode && { postalCode: options.postalCode }),
    addressRegion: "Centre-Val de Loire",
    addressCountry: "FR",
  };
}

type LodgingBusinessOptions = {
  description?: string | null;
  telephone?: string | null;
  email?: string | null;
  heroImage?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  priceRange?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  numberOfRooms?: number | null;
  petsAllowed?: boolean | null;
  amenities?: CmsAmenity[];
  testimonials?: CmsTestimonial[];
};

export function generateLodgingBusinessJsonLd(
  options?: LodgingBusinessOptions,
) {
  const amenityFeatures =
    options?.amenities && options.amenities.length > 0
      ? options.amenities.map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: a.name,
          value: true,
        }))
      : [
          {
            "@type": "LocationFeatureSpecification",
            name: "WiFi",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Parking",
            value: true,
          },
          {
            "@type": "LocationFeatureSpecification",
            name: "Jardin",
            value: true,
          },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: "L'Instant Tranquille",
    description:
      options?.description ||
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    url: SITE_URL,
    ...(options?.telephone && { telephone: options.telephone }),
    ...(options?.email && { email: options.email }),
    ...(options?.heroImage && { image: options.heroImage }),
    address: buildPostalAddress(options),
    ...(options?.lat &&
      options?.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: options.lat,
          longitude: options.lng,
        },
      }),
    amenityFeature: amenityFeatures,
    ...(options?.numberOfRooms != null && {
      numberOfRooms: options.numberOfRooms,
    }),
    ...(options?.petsAllowed != null && { petsAllowed: options.petsAllowed }),
    ...(options?.priceRange && { priceRange: options.priceRange }),
    ...(options?.checkInTime && { checkinTime: options.checkInTime }),
    ...(options?.checkOutTime && { checkoutTime: options.checkOutTime }),
    ...buildReviewFields(options?.testimonials),
  };
}

export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[],
) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function generateVacationRentalJsonLd(options?: {
  description?: string | null;
  url?: string | null;
  heroImage?: string | null;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  amenities?: CmsAmenity[];
  testimonials?: CmsTestimonial[];
}) {
  const amenityFeature =
    options?.amenities && options.amenities.length > 0
      ? {
          amenityFeature: options.amenities.map((a) => ({
            "@type": "LocationFeatureSpecification",
            name: a.name,
            value: true,
          })),
        }
      : {};

  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${SITE_URL}/le-gite#rental`,
    name: "L'Instant Tranquille",
    description:
      options?.description ||
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    url: options?.url || `${SITE_URL}/le-gite`,
    ...(options?.heroImage && { image: options.heroImage }),
    address: buildPostalAddress(options),
    ...(options?.lat &&
      options?.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: options.lat,
          longitude: options.lng,
        },
      }),
    ...(options?.maxGuests && {
      occupancy: { "@type": "QuantitativeValue", value: options.maxGuests },
    }),
    ...(options?.bedrooms && { numberOfBedrooms: options.bedrooms }),
    ...(options?.bathrooms && { numberOfBathroomsTotal: options.bathrooms }),
    ...(options?.surface && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: options.surface,
        unitCode: "MTK",
      },
    }),
    ...amenityFeature,
    ...buildReviewFields(options?.testimonials),
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function computePriceRange(
  seasons?: CmsSeason[] | null,
  currency = "EUR",
): string | undefined {
  const rates = (seasons || [])
    .map((s) => s?.nightlyRate)
    .filter((r): r is number => typeof r === "number" && r > 0);
  if (rates.length === 0) return undefined;
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const symbol = currency === "EUR" ? "€" : currency;
  return min === max
    ? `${min} ${symbol}`
    : `${min} ${symbol} – ${max} ${symbol}`;
}

function seasonToOffer(season: CmsSeason, currency: string) {
  const year = new Date().getFullYear();
  const pad = (n: number) => String(n).padStart(2, "0");
  const toDate = (month?: string | null, day?: number | null) =>
    month && day ? `${year}-${pad(Number(month))}-${pad(day)}` : undefined;
  const validFrom = toDate(season.startMonth, season.startDay);
  const validThrough = toDate(season.endMonth, season.endDay);

  return {
    "@type": "Offer",
    name: season.name,
    availability: "https://schema.org/InStock",
    ...(season.nightlyRate != null && {
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: season.nightlyRate,
        priceCurrency: currency,
        unitCode: "DAY",
        unitText: "par nuit",
      },
    }),
    ...(validFrom && { validFrom }),
    ...(validThrough && { validThrough }),
    ...(season.minimumStay && {
      eligibleQuantity: {
        "@type": "QuantitativeValue",
        minValue: season.minimumStay,
        unitCode: "DAY",
      },
    }),
  };
}

export function generatePricingJsonLd(
  seasons?: CmsSeason[] | null,
  options?: { currency?: string | null },
) {
  const currency = options?.currency || "EUR";
  const offers = (seasons || [])
    .filter((s) => s?.nightlyRate != null)
    .map((s) => seasonToOffer(s, currency));
  if (offers.length === 0) return null;
  const priceRange = computePriceRange(seasons, currency);

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: "L'Instant Tranquille",
    url: `${SITE_URL}/tarifs-reservation`,
    ...(priceRange && { priceRange }),
    makesOffer: offers,
  };
}
