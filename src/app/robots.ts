import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

const PRIVATE_PATHS = ["/admin", "/api"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: ["*", ...AI_CRAWLERS],
      allow: ["/", "/api/media/"],
      disallow: PRIVATE_PATHS,
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
