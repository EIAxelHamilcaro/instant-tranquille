import { permanentRedirect } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { getRedirectRules } from "@/lib/queries";
import { resolveRedirect } from "@/lib/redirects";
import { SITE_URL } from "@/lib/seo";

export async function followRedirect(path: string, locale: Locale) {
  const destination = resolveRedirect(
    path,
    locale,
    await getRedirectRules(),
    SITE_URL,
  );

  if (destination) permanentRedirect(destination);
}
