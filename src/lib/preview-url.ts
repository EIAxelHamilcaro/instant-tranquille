/**
 * Build a live preview URL respecting next-intl localePrefix: "as-needed"
 * (default locale "fr" has no prefix, others do)
 */
export function previewUrl(
  path: string,
  { locale }: { locale?: { code?: string } } = {},
) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lp = !locale?.code || locale.code === "fr" ? "" : `/${locale.code}`;
  return `${base}${lp}${path}`;
}
