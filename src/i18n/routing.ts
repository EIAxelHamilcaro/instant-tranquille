import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/le-gite": {
      fr: "/le-gite",
      en: "/the-cottage",
    },
    "/tarifs-reservation": {
      fr: "/tarifs-reservation",
      en: "/rates-booking",
    },
    "/contact": "/contact",
    "/livret-accueil/[accessToken]": {
      fr: "/livret-accueil/[accessToken]",
      en: "/welcome-booklet/[accessToken]",
    },
  },
});
