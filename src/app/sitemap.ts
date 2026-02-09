import type { MetadataRoute } from "next";
import { getPayload } from "@/lib/payload";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pages = [
    { slug: "home", path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { slug: "le-gite", path: "/le-gite", priority: 0.9, changeFrequency: "monthly" as const },
    {
      slug: "tarifs-reservation",
      path: "/tarifs-reservation",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    { slug: "contact", path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const enPaths: Record<string, string> = {
    "/": "/en",
    "/le-gite": "/en/the-cottage",
    "/tarifs-reservation": "/en/rates-booking",
    "/contact": "/en/contact",
  };

  let pageUpdates: Record<string, Date> = {};
  try {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "pages",
      limit: 10,
      select: { slug: true, updatedAt: true },
    });
    for (const doc of result.docs) {
      const d = doc as Record<string, any>;
      if (d.slug && d.updatedAt) {
        pageUpdates[d.slug as string] = new Date(d.updatedAt as string);
      }
    }
  } catch {
    // Fallback to current date if Payload is unavailable
  }

  return pages.flatMap(({ slug, path, priority, changeFrequency }) => {
    const lastModified = pageUpdates[slug] || new Date();
    return [
      {
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            fr: `${siteUrl}${path}`,
            en: `${siteUrl}${enPaths[path]}`,
          },
        },
      },
      {
        url: `${siteUrl}${enPaths[path]}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            fr: `${siteUrl}${path}`,
            en: `${siteUrl}${enPaths[path]}`,
          },
        },
      },
    ];
  });
}
