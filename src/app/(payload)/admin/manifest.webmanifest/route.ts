import config from "@payload-config";
import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { defaultLocale } from "@/i18n/config";
import { ADMIN_APP_NAME, ADMIN_ICONS, ADMIN_THEME } from "@/lib/admin-app";

export async function GET() {
  const [{ routes }, common] = await Promise.all([
    config,
    getTranslations({ locale: defaultLocale, namespace: "common" }),
  ]);

  const manifest: MetadataRoute.Manifest = {
    id: routes.admin,
    name: `${common("siteName")}, gestion du site`,
    short_name: ADMIN_APP_NAME,
    description:
      "L'espace où les hôtes modifient les textes, les photos et les tarifs du site.",
    lang: defaultLocale,
    dir: "ltr",
    start_url: routes.admin,
    scope: routes.admin,
    display: "standalone",
    orientation: "any",
    background_color: ADMIN_THEME.background,
    theme_color: ADMIN_THEME.bar,
    icons: [
      {
        src: ADMIN_ICONS.small,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ADMIN_ICONS.large,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: ADMIN_ICONS.maskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };

  return Response.json(manifest, {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
