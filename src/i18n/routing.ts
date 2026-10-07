import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/le-gite": {
      fr: "/le-gite",
      en: "/the-cottage",
    },
    "/les-alentours": {
      fr: "/les-alentours",
      en: "/surroundings",
    },
    "/guides": "/guides",
    "/guides/[slug]": "/guides/[slug]",
    "/tarifs-reservation": {
      fr: "/tarifs-reservation",
      en: "/rates-booking",
    },
    "/contact": "/contact",
    "/mentions-legales": {
      fr: "/mentions-legales",
      en: "/legal-notice",
    },
    "/confidentialite": {
      fr: "/confidentialite",
      en: "/privacy-policy",
    },
  },
});

export type StaticPathname = Exclude<
  keyof typeof routing.pathnames,
  "/guides/[slug]"
>;
