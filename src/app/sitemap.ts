import type { MetadataRoute } from "next";
import { getPayload } from "@/lib/payload";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const pages = [
  {
    slug: "home",
    path: "/",
    priority: 1.0,
    changeFrequency: "weekly" as const,
    images: [
      `${siteUrl}/images/salon-cheminee-canapes-tv.webp`,
      `${siteUrl}/images/jardin-terrasse-vue-ensemble.webp`,
      `${siteUrl}/images/sejour-canape-buffet-escalier.webp`,
    ],
  },
  {
    slug: "le-gite",
    path: "/le-gite",
    priority: 0.9,
    changeFrequency: "monthly" as const,
    images: [
      `${siteUrl}/images/chambre-1-lit-double-vert-sauge.webp`,
      `${siteUrl}/images/chambre-1-vue-ensemble-papier-peint-foret.webp`,
      `${siteUrl}/images/chambre-2-lit-double-sous-pente-terracotta.webp`,
      `${siteUrl}/images/chambre-2-tete-de-lit-sous-pente.webp`,
      `${siteUrl}/images/chambre-3-lits-simples-sous-pente.webp`,
      `${siteUrl}/images/cuisine-equipee-verte-poutres.webp`,
      `${siteUrl}/images/salon-baby-foot-mur-briques.webp`,
      `${siteUrl}/images/sejour-canape-tv-escalier.webp`,
      `${siteUrl}/images/entree-commode-deco-briques.webp`,
    ],
  },
  {
    slug: "les-alentours",
    path: "/les-alentours",
    priority: 0.8,
    changeFrequency: "monthly" as const,
    images: [
      `${siteUrl}/images/jardin-terrasse-vue-ensemble.webp`,
      `${siteUrl}/images/terrasse-salon-jardin.webp`,
    ],
  },
  {
    slug: "tarifs-reservation",
    path: "/tarifs-reservation",
    priority: 0.8,
    changeFrequency: "weekly" as const,
    images: [`${siteUrl}/images/sejour-canape-buffet-escalier.webp`],
  },
  {
    slug: "contact",
    path: "/contact",
    priority: 0.7,
    changeFrequency: "monthly" as const,
    images: [`${siteUrl}/images/entree-porte-manteau-papier-peint-herons.webp`],
  },
];

const enPaths: Record<string, string> = {
  "/": "/en",
  "/le-gite": "/en/the-cottage",
  "/les-alentours": "/en/surroundings",
  "/tarifs-reservation": "/en/rates-booking",
  "/contact": "/en/contact",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageUpdates: Record<string, Date> = {};
  try {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "pages",
      limit: 10,
      select: { slug: true, updatedAt: true },
    });
    for (const doc of result.docs) {
      const d = doc as Record<string, unknown>;
      if (d.slug && d.updatedAt) {
        pageUpdates[d.slug as string] = new Date(d.updatedAt as string);
      }
    }
  } catch {
    // Fallback to current date if Payload is unavailable
  }

  return pages.flatMap(({ slug, path, priority, changeFrequency, images }) => {
    const lastModified = pageUpdates[slug] || new Date();
    const enPath = enPaths[path] ?? `${path}`;
    return [
      {
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            fr: `${siteUrl}${path}`,
            en: `${siteUrl}${enPath}`,
          },
        },
        images,
      },
      {
        url: `${siteUrl}${enPath}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            fr: `${siteUrl}${path}`,
            en: `${siteUrl}${enPath}`,
          },
        },
        images,
      },
    ];
  });
}
