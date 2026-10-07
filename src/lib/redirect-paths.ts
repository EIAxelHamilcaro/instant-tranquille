import { type Locale, locales } from "@/i18n/config";
import { routing, type StaticPathname } from "@/i18n/routing";
import { ROUTED_SEGMENTS } from "@/lib/root-routes";

const RESERVED_SEGMENTS = ROUTED_SEGMENTS.filter(
  (segment) => !locales.some((locale) => locale === segment),
);

const staticPathnames = Object.entries(routing.pathnames).filter(
  ([pathname]) => !pathname.includes("["),
) as [StaticPathname, string | Record<Locale, string>][];

export const pageByPath = new Map(
  staticPathnames.flatMap(([pathname, localized]) =>
    (typeof localized === "string"
      ? [localized]
      : Object.values(localized)
    ).map((path) => [path, pathname] as const),
  ),
);

function ownPath(address: string, siteUrl: string) {
  if (address.startsWith("/")) return address;

  const site = new URL(siteUrl);
  const url = URL.canParse(address)
    ? new URL(address)
    : URL.canParse(`https://${address}`)
      ? new URL(`https://${address}`)
      : null;
  const bare = (hostname: string) => hostname.replace(/^www\./, "");

  return url && bare(url.hostname) === bare(site.hostname)
    ? url.pathname
    : null;
}

export function sitePath(address: string, siteUrl: string) {
  const path = ownPath(address.trim(), siteUrl);
  if (path === null) return null;

  const [pathname = "/"] = path.split(/[?#]/);
  const segments = pathname.split("/").filter(Boolean);
  const [first] = segments;
  const withoutLocale = locales.some((locale) => locale === first)
    ? segments.slice(1)
    : segments;

  return `/${withoutLocale.join("/")}`;
}

export function isReservedPath(path: string) {
  const [first = ""] = path.split("/").filter(Boolean);

  return RESERVED_SEGMENTS.includes(first) || first.includes(".");
}

export const isSitePage = (path: string) => pageByPath.has(path);
