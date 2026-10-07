import { getRequestConfig } from "next-intl/server";
import type { Locale } from "./config";
import { routing } from "./routing";

const NAMESPACES = [
  "common",
  "home",
  "cottage",
  "surroundings",
  "guides",
  "rates",
  "contact",
  "share",
  "film",
  "legal",
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  const files = await Promise.all(
    NAMESPACES.map(
      async (namespace) =>
        (await import(`./messages/${locale}/${namespace}.json`)).default,
    ),
  );

  return { locale, messages: Object.assign({}, ...files) };
});
