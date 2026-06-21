import { getHeaderData, getSiteSettings } from "@/lib/queries";
import { HeaderClient } from "./HeaderClient";

type NavItem = {
  label: string;
  url: string;
  isExternal?: boolean | null;
  highlight?: boolean | null;
};

export async function Header({ locale }: { locale: string }) {
  const [headerData, siteSettings] = await Promise.all([
    getHeaderData(locale),
    getSiteSettings(locale),
  ]);

  const header = headerData as Record<string, unknown>;
  const settings = siteSettings as Record<string, unknown>;

  const navItems: NavItem[] = ((header.navItems || []) as NavItem[]).map(
    (item) => ({
      label: item.label,
      url: item.url,
      isExternal: item.isExternal,
      highlight: item.highlight,
    }),
  );

  const ctaButtonRaw = header.ctaButton as Record<string, unknown> | undefined;
  const ctaButton = ctaButtonRaw?.label
    ? {
        label: ctaButtonRaw.label as string,
        url: (ctaButtonRaw.url as string) || "/",
      }
    : null;

  const siteName = (settings.siteName as string) || "L'Instant Tranquille";
  const logo = settings.logo as
    | {
        url?: string | null;
        alt?: string | null;
        width?: number | null;
        height?: number | null;
      }
    | null
    | undefined;

  return (
    <HeaderClient
      navItems={navItems}
      ctaButton={ctaButton}
      siteName={siteName}
      logo={logo}
    />
  );
}
