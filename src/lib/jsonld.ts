import type {
  CmsAmenity,
  CmsRecommendation,
  CmsSeason,
  CmsTestimonial,
} from "./queries";

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
      ratingValue: Number(
        (
          testimonials.reduce((sum, t) => sum + t.rating, 0) /
          testimonials.length
        ).toFixed(1),
      ),
      reviewCount: testimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: testimonials.slice(0, 5).map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.guestName },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
      reviewBody: t.text,
      ...(t.stayDate && {
        datePublished: t.stayDate,
        contentReferenceTime: t.stayDate,
      }),
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

const KNOWN_ABSENT_AMENITIES = [
  "Hébergement chevaux",
  "Piscine",
  "Jacuzzi",
  "Ascenseur",
];

function buildAmenityFeature(
  amenities?: CmsAmenity[],
): Record<string, unknown> {
  const present = (amenities ?? []).map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a.name,
    value: true,
  }));
  const absent = KNOWN_ABSENT_AMENITIES.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: false,
  }));
  const all = [...present, ...absent];
  return all.length > 0 ? { amenityFeature: all } : {};
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
  sameAs?: string[] | null;
};

export function generateLodgingBusinessJsonLd(
  options?: LodgingBusinessOptions,
) {
  const sameAsUrls = (options?.sameAs ?? []).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: "L'Instant Tranquille",
    description:
      options?.description ||
      "Gîte en Sologne, 3 chambres, 6 personnes, 120 m² — Romorantin-Lanthenay, entre forêts et châteaux de la Loire.",
    url: SITE_URL,
    ...(sameAsUrls.length > 0 && { sameAs: sameAsUrls }),
    ...(options?.telephone && { telephone: options.telephone }),
    ...(options?.email && { email: options.email }),
    ...(options?.heroImage && { image: options.heroImage }),
    address: buildPostalAddress(options),
    ...(options?.lat != null &&
      options?.lng != null && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: Number(options.lat.toFixed(5)),
          longitude: Number(options.lng.toFixed(5)),
        },
      }),
    ...buildAmenityFeature(options?.amenities),
    ...(options?.numberOfRooms != null && {
      numberOfRooms: options.numberOfRooms,
    }),
    ...(options?.petsAllowed != null && { petsAllowed: options.petsAllowed }),
    ...(options?.priceRange && { priceRange: options.priceRange }),
    ...(options?.checkInTime && {
      checkinTime: options.checkInTime.includes("T")
        ? options.checkInTime
        : `T${options.checkInTime}`,
    }),
    ...(options?.checkOutTime && {
      checkoutTime: options.checkOutTime.includes("T")
        ? options.checkOutTime
        : `T${options.checkOutTime}`,
    }),
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
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    "@id": `${SITE_URL}/le-gite#rental`,
    containedInPlace: { "@id": BUSINESS_ID },
    name: "L'Instant Tranquille",
    description:
      options?.description ||
      "Gîte en Sologne, 3 chambres, 6 personnes, 120 m² — Romorantin-Lanthenay, entre forêts et châteaux de la Loire.",
    url: options?.url || `${SITE_URL}/le-gite`,
    ...(options?.heroImage && { image: options.heroImage }),
    address: buildPostalAddress(options),
    ...(options?.lat != null &&
      options?.lng != null && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: Number(options.lat.toFixed(5)),
          longitude: Number(options.lng.toFixed(5)),
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
    ...buildAmenityFeature(options?.amenities),
    ...buildReviewFields(options?.testimonials),
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "L'Instant Tranquille",
    url: SITE_URL,
    inLanguage: ["fr-FR", "en"],
    publisher: { "@id": BUSINESS_ID },
  };
}

export function generateTouristAttractionJsonLd(
  rec: Pick<
    CmsRecommendation,
    | "name"
    | "description"
    | "address"
    | "website"
    | "coordinates"
    | "distanceFromGite"
  > & { image?: string | null },
) {
  const descriptionText =
    typeof rec.description === "string"
      ? rec.description
      : extractPlainText(rec.description);

  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: rec.name,
    ...(descriptionText && { description: descriptionText }),
    ...(rec.address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: rec.address,
        addressCountry: "FR",
      },
    }),
    ...(rec.coordinates?.lat != null &&
      rec.coordinates?.lng != null && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: Number(rec.coordinates.lat.toFixed(5)),
          longitude: Number(rec.coordinates.lng.toFixed(5)),
        },
      }),
    ...(rec.website && { url: rec.website }),
    ...(rec.image && { image: rec.image }),
    touristType: {
      "@type": "Audience",
      audienceType: "Touristes en Sologne",
    },
  };
}

export function generateGrandParquetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "@id": "https://www.grandparquet.com/#venue",
    name: "Le Grand Parquet de Lamotte-Beuvron",
    description:
      "Site fédéral de la FFE (Fédération Française d'Équitation), accueille le Generali Open de France — concours de saut d'obstacles du calendrier national. À environ 17 km du gîte L'Instant Tranquille.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lamotte-Beuvron",
      postalCode: "41600",
      addressCountry: "FR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.60028,
      longitude: 2.02806,
    },
    url: "https://www.grandparquet.com",
    touristType: {
      "@type": "Audience",
      audienceType: "Cavaliers et amateurs de sports équestres",
    },
    isAccessibleForFree: false,
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
    ...(priceRange && { priceRange }),
    makesOffer: offers,
  };
}

export function buildCottageFaqItems(locale: string): {
  question: string;
  answer: string;
}[] {
  if (locale === "en") {
    return [
      {
        question: "How many guests can the cottage accommodate?",
        answer: "The cottage sleeps up to 6 guests across 3 bedrooms (120 m²).",
      },
      {
        question: "Are pets allowed?",
        answer:
          "Pets may be accepted upon prior request. Please contact us before booking.",
      },
      {
        question: "Does the cottage have a kitchen?",
        answer:
          "Yes, the cottage has a fully equipped kitchen with fridge, oven, microwave and dishwasher.",
      },
      {
        question: "Is the cottage suitable for riders and equestrian stays?",
        answer:
          "Yes. The cottage is located approximately 17 km from the Grand Parquet de Lamotte-Beuvron (FFE equestrian venue). It provides comfortable accommodation for riders attending competitions or on a leisure trip, while their horses are stabled at local centres.",
      },
    ];
  }
  return [
    {
      question: "Combien de personnes le gîte peut-il accueillir ?",
      answer: "Le gîte accueille jusqu'à 6 personnes dans 3 chambres (120 m²).",
    },
    {
      question: "Les animaux sont-ils acceptés ?",
      answer:
        "Les animaux peuvent être acceptés sur demande préalable. Contactez-nous avant de réserver.",
    },
    {
      question: "Y a-t-il une cuisine équipée ?",
      answer:
        "Oui, le gîte dispose d'une cuisine entièrement équipée (réfrigérateur, four, micro-ondes, lave-vaisselle).",
    },
    {
      question:
        "Le gîte est-il adapté aux séjours de cavaliers et aux concours équestres ?",
      answer:
        "Oui. Le gîte est situé à environ 17 km du Grand Parquet de Lamotte-Beuvron (site FFE). Il offre un hébergement confortable aux cavaliers en déplacement pour des concours ou un séjour de loisir, leurs montures étant hébergées dans les écuries ou centres équestres des environs.",
    },
  ];
}

export function buildRatesFaqItems(locale: string): {
  question: string;
  answer: string;
}[] {
  if (locale === "en") {
    return [
      {
        question: "What is the minimum stay?",
        answer:
          "The minimum stay varies by season — typically 2 nights in low season and 7 nights in high season (July–August). Check the seasonal calendar for details.",
      },
      {
        question: "Is a deposit required?",
        answer:
          "A security deposit is required and will be returned after your stay if no damage is found.",
      },
      {
        question: "What are the check-in and check-out times?",
        answer:
          "Check-in is from 4:00 PM and check-out is before 10:00 AM, unless otherwise agreed.",
      },
      {
        question:
          "Can I book directly without going through Airbnb or Booking?",
        answer:
          "Yes, direct booking is possible. Contact us by email or phone and we will send you a direct rental agreement.",
      },
    ];
  }
  return [
    {
      question: "Quelle est la durée minimale de séjour ?",
      answer:
        "La durée minimale varie selon la saison — généralement 2 nuits en basse saison et 7 nuits en haute saison (juillet–août). Consultez le calendrier saisonnier pour les détails.",
    },
    {
      question: "Une caution est-elle demandée ?",
      answer:
        "Oui, une caution est demandée et restituée après votre séjour en l'absence de dégâts.",
    },
    {
      question: "Quels sont les horaires d'arrivée et de départ ?",
      answer:
        "L'arrivée est à partir de 16h00 et le départ avant 10h00, sauf accord préalable.",
    },
    {
      question:
        "Peut-on réserver en direct sans passer par Airbnb ou Booking ?",
      answer:
        "Oui, la réservation directe est possible. Contactez-nous par email ou téléphone et nous vous transmettrons un contrat de location direct.",
    },
  ];
}

export function buildSurroundingsFaqItems(locale: string): {
  question: string;
  answer: string;
}[] {
  if (locale === "en") {
    return [
      {
        question: "How far is Château de Chambord from the cottage?",
        answer:
          "Château de Chambord is approximately 12 km from the cottage (about 15 minutes by car).",
      },
      {
        question: "What can you do in Sologne?",
        answer:
          "The Sologne offers forests, ponds, cycling trails, hunting and fishing activities, Loire Valley châteaux (Chambord, Cheverny, Blois), local restaurants and weekly markets.",
      },
      {
        question:
          "Is the cottage close to the Grand Parquet de Lamotte-Beuvron?",
        answer:
          "Yes, the Grand Parquet de Lamotte-Beuvron (FFE federal equestrian venue, host of the Generali Open de France) is approximately 17 km from the cottage — about 20 minutes by car via the D724.",
      },
      {
        question: "Are there cycling or hiking trails near the cottage?",
        answer:
          "Yes, numerous marked trails and cycling routes cross the Sologne forests and pass near Romorantin-Lanthenay.",
      },
    ];
  }
  return [
    {
      question: "À quelle distance se trouve le château de Chambord ?",
      answer:
        "Le château de Chambord est à environ 12 km du gîte, soit environ 15 minutes en voiture.",
    },
    {
      question: "Que faire en Sologne depuis le gîte ?",
      answer:
        "La Sologne offre forêts, étangs, pistes cyclables, chasse, pêche, châteaux de la Loire (Chambord, Cheverny, Blois), restaurants locaux et marchés hebdomadaires.",
    },
    {
      question: "Le gîte est-il proche du Grand Parquet de Lamotte-Beuvron ?",
      answer:
        "Oui, le Grand Parquet de Lamotte-Beuvron (site fédéral FFE, qui accueille le Generali Open de France) est à environ 17 km du gîte, soit 20 minutes en voiture par la D724.",
    },
    {
      question: "Y a-t-il des sentiers cyclables ou de randonnée à proximité ?",
      answer:
        "Oui, de nombreux sentiers balisés et pistes cyclables parcourent les forêts de Sologne et passent à proximité de Romorantin-Lanthenay.",
    },
  ];
}
