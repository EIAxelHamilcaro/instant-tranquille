import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@payload-config": "./src/payload.config.ts",
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: 31536000,
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "http" as const,
              hostname: "localhost",
              port: "3000",
              pathname: "/api/media/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
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
