import type { CmsTestimonial, CmsAmenity } from "./queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type LodgingBusinessOptions = {
  telephone?: string | null;
  email?: string | null;
  heroImage?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  priceRange?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  amenities?: CmsAmenity[];
  testimonials?: CmsTestimonial[];
};

export function generateLodgingBusinessJsonLd(options?: LodgingBusinessOptions) {
  const aggregateRating =
    options?.testimonials && options.testimonials.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              options.testimonials.reduce((sum, t) => sum + t.rating, 0) /
              options.testimonials.length
            ).toFixed(1),
            reviewCount: options.testimonials.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {};

  const reviews =
    options?.testimonials && options.testimonials.length > 0
      ? {
          review: options.testimonials.slice(0, 5).map((t) => ({
            "@type": "Review",
            author: { "@type": "Person", name: t.guestName },
            reviewRating: {
              "@type": "Rating",
              ratingValue: t.rating,
              bestRating: 5,
            },
            reviewBody: t.text,
            ...(t.stayDate && { datePublished: t.stayDate }),
          })),
        }
      : {};

  const amenityFeatures =
    options?.amenities && options.amenities.length > 0
      ? options.amenities.map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: a.name,
          value: true,
        }))
      : [
          { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
          { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
          { "@type": "LocationFeatureSpecification", name: "Garden", value: true },
        ];

  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "L'Instant Tranquille",
    description:
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    url: SITE_URL,
    ...(options?.telephone && { telephone: options.telephone }),
    ...(options?.email && { email: options.email }),
    ...(options?.heroImage && { image: options.heroImage }),
    address: {
      "@type": "PostalAddress",
      ...(options?.address && { streetAddress: options.address }),
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
    ...(options?.lat &&
      options?.lng && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: options.lat,
          longitude: options.lng,
        },
      }),
    amenityFeature: amenityFeatures,
    numberOfRooms: 3,
    petsAllowed: false,
    ...(options?.priceRange && { priceRange: options.priceRange }),
    ...(options?.checkInTime && { checkinTime: options.checkInTime }),
    ...(options?.checkOutTime && { checkoutTime: options.checkOutTime }),
    ...aggregateRating,
    ...reviews,
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateVacationRentalJsonLd(options?: {
  heroImage?: string | null;
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: "L'Instant Tranquille",
    description:
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    url: `${SITE_URL}/le-gite`,
    ...(options?.heroImage && { image: options.heroImage }),
    address: {
      "@type": "PostalAddress",
      ...(options?.address && { streetAddress: options.address }),
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
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
