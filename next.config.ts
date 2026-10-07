import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { UNKNOWN_ROOT_SEGMENT } from "./src/lib/root-routes";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

const isLocalSite =
  !process.env.VERCEL && ["localhost", "127.0.0.1"].includes(siteUrl.hostname);

const MERGED_GUIDES = {
  "hebergement-cavaliers-lamotte-beuvron": "tourisme-equestre-en-sologne",
  "generali-open-de-france-ou-dormir": "tourisme-equestre-en-sologne",
  "game-fair-lamotte-beuvron-hebergement": "tourisme-equestre-en-sologne",
  "coucher-de-soleil-et-apero-sur-la-loire-en-bateau":
    "balade-en-bateau-sur-la-loire-depuis-la-sologne",
  "vouvray-et-montlouis-caves-a-visiter-depuis-romorantin":
    "route-des-vins-cheverny-touraine-depuis-la-sologne",
  "incontournables-centre-val-de-loire-depuis-romorantin":
    "chateaux-de-la-loire-depuis-romorantin",
};

const STATIC_ASSET_CACHE =
  "public, max-age=604800, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "/*": ["scripts/**/*", "media/**/*"],
  },
  outputFileTracingIncludes: {
    "/og/[locale]/[...key]": ["./src/assets/share-scenes/*"],
  },
  turbopack: {
    resolveAlias: {
      "@payload-config": "./src/payload.config.ts",
    },
  },
  images: {
    formats: ["image/avif"],
    qualities: [75],
    deviceSizes: [640, 828, 1200, 1920, 2400],
    imageSizes: [384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowLocalIP: isLocalSite,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: siteUrl.protocol === "https:" ? "https" : "http",
        hostname: siteUrl.hostname,
        port: siteUrl.port,
        pathname: "/api/media/**",
      },
    ],
  },
  async redirects() {
    return Object.entries(MERGED_GUIDES).flatMap(([merged, target]) =>
      ["", "/en"].map((prefix) => ({
        source: `${prefix}/guides/${merged}`,
        destination: `${prefix}/guides/${target}`,
        permanent: true,
      })),
    );
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: `/:segment(${UNKNOWN_ROOT_SEGMENT})/:rest*`,
          destination: "/fr/:segment/:rest*",
        },
      ],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:folder(videos|sounds|images|icons)/:file*",
        headers: [{ key: "Cache-Control", value: STATIC_ASSET_CACHE }],
      },
      {
        source: "/(.*)",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts : Next.js inline + Turnstile + éventuels analytiques
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              // Styles : inline (Tailwind + shadcn)
              "style-src 'self' 'unsafe-inline'",
              // Images : self + Vercel Blob + tuiles OpenStreetMap + data URIs (blur-up)
              "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.tile.openstreetmap.org https://tile.openstreetmap.org",
              // Fonts : self uniquement (Google Fonts servi localement via next/font)
              "font-src 'self'",
              // Connects : API Payload + Turnstile
              "connect-src 'self' https://challenges.cloudflare.com https://*.public.blob.vercel-storage.com",
              // Frames : Turnstile iframe
              "frame-src 'self' https://challenges.cloudflare.com",
              // Workers : Next.js SW
              "worker-src 'self' blob:",
              // Media
              "media-src 'self' https://*.public.blob.vercel-storage.com",
              // OG preview fetch (navigateurs modernes)
              "manifest-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withPayload(withNextIntl(nextConfig));
