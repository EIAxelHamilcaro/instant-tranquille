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
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Trees className="h-7 w-7 text-primary-500" />
          <span className="font-heading text-xl font-bold text-foreground">
            {siteName}
          </span>
        </Link>

        <HeaderClient navItems={navItems} ctaButton={ctaButton} />
      </div>
    </header>
  );
}
