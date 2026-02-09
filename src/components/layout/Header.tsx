import { Link } from "@/i18n/navigation";
import { getHeaderData, getSiteSettings } from "@/lib/queries";
import { Trees } from "lucide-react";
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

  const header = headerData as Record<string, any>;
  const settings = siteSettings as Record<string, any>;

  const navItems: NavItem[] = ((header.navItems || []) as NavItem[]).map((item) => ({
    label: item.label,
    url: item.url,
    isExternal: item.isExternal,
    highlight: item.highlight,
  }));

  const ctaButton = header.ctaButton?.label
    ? { label: header.ctaButton.label as string, url: (header.ctaButton.url as string) || "/" }
    : null;

  const siteName = (settings.siteName as string) || "L'Instant Tranquille";

  return (
    <HeaderClient navItems={navItems} ctaButton={ctaButton} siteName={siteName} />
  );
}
