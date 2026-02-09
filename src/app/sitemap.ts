import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/le-gite", priority: 0.9, changeFrequency: "monthly" as const },
    {
      path: "/tarifs-reservation",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  const enPaths: Record<string, string> = {
    "/": "/en",
    "/le-gite": "/en/the-cottage",
    "/tarifs-reservation": "/en/rates-booking",
    "/contact": "/en/contact",
  };

  return pages.flatMap(({ path, priority, changeFrequency }) => [
    {
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          fr: `${siteUrl}${path}`,
          en: `${siteUrl}${enPaths[path]}`,
        },
      },
    },
  ]);
}
