const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateLodgingBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "L'Instant Tranquille",
    description:
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressRegion: "Centre-Val de Loire",
      addressCountry: "FR",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Garden", value: true },
    ],
    numberOfRooms: 3,
    petsAllowed: false,
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
