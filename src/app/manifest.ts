import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";
import { getGlobal } from "@/lib/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [common, home, settings] = await Promise.all([
    getTranslations({ locale: defaultLocale, namespace: "common" }),
    getGlobal("home-page", defaultLocale),
    getGlobal("site-settings", defaultLocale),
  ]);

  return {
    id: "/",
    name: [common("siteName"), settings.tagline].filter(Boolean).join(", "),
    short_name: common("siteName"),
    description: home.meta?.description ?? home.lede ?? undefined,
    lang: defaultLocale,
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e9ede5",
    theme_color: "#0e2b28",
    categories: ["travel"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
