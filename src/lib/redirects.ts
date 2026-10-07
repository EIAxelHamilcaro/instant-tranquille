import type { Locale } from "@/i18n/config";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageByPath, sitePath } from "@/lib/redirect-paths";

export type RedirectTarget =
  | { kind: "guide"; slug: string }
  | { kind: "address"; url: string };

export interface RedirectRule {
  from: string;
  to: RedirectTarget;
}

const GUIDE_PATH = /^\/guides\/([^/]+)$/;
function destinationOf(
  target: RedirectTarget,
  locale: Locale,
  siteUrl: string,
) {
  if (target.kind === "guide") {
    return getPathname({
      href: { pathname: "/guides/[slug]", params: { slug: target.slug } },
      locale,
    });
  }

  const path = sitePath(target.url, siteUrl);
  if (path === null) return URL.canParse(target.url) ? target.url : null;

  const page = pageByPath.get(path);
  if (page) return getPathname({ href: page, locale });

  const slug = GUIDE_PATH.exec(path)?.[1];
  if (slug) return destinationOf({ kind: "guide", slug }, locale, siteUrl);

  return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

export function resolveRedirect(
  path: string,
  locale: Locale,
  rules: RedirectRule[],
  siteUrl: string,
) {
  const rule = rules.find(({ from }) => from === path);
  if (!rule) return null;

  const destination = destinationOf(rule.to, locale, siteUrl);
  const requested =
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  return destination && destination !== requested ? destination : null;
}
