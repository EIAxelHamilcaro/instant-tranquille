"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface MainNavProps {
  className?: string;
  onNavigate?: () => void;
}

export function MainNav({ className, onNavigate }: MainNavProps) {
  const t = useTranslations("common");
  const pathname = usePathname();

  return (
    <nav aria-label={t("mainNav")} className={cn("navigation", className)}>
      {NAV_ITEMS.map(({ key, href }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname.startsWith(href) ? "page" : undefined}
          onClick={onNavigate}
        >
          {t(`nav.${key}`)}
        </Link>
      ))}
    </nav>
  );
}
