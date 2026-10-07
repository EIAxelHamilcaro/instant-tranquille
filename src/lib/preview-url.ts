import { createHmac } from "node:crypto";
import { defaultLocale, locales } from "@/i18n/config";
import { routing } from "@/i18n/routing";

const SAFE_PATH = /^\/(?!\/)[\w\-./~%]*$/;

export const isSafeRedirectPath = (path: string) => SAFE_PATH.test(path);

export const previewSecret = () =>
  process.env.PREVIEW_SECRET ||
  createHmac("sha256", process.env.PAYLOAD_SECRET ?? "")
    .update("live-preview")
    .digest("hex");

type PreviewPathname = keyof typeof routing.pathnames;

interface PreviewOptions {
  locale?: { code?: string };
  params?: Record<string, string>;
}

export function previewUrl(
  pathname: PreviewPathname,
  { locale, params = {} }: PreviewOptions = {},
) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const code = locales.find((item) => item === locale?.code) ?? defaultLocale;
  const template = routing.pathnames[pathname];
  const localized = typeof template === "string" ? template : template[code];
  const path = Object.entries(params).reduce<string>(
    (current, [name, value]) => current.replace(`[${name}]`, value),
    localized,
  );
  const prefix = code === defaultLocale ? "" : `/${code}`;
  const query = new URLSearchParams({
    secret: previewSecret(),
    slug: `${prefix}${path}`.replace(/(.)\/$/, "$1"),
  });

  return `${base}/api/preview?${query}`;
}
