"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/i18n/config";
import { getPathname, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("common");
  const current = useLocale();
  const pathname = usePathname();
  const params = useParams();

  return (
    <nav
      aria-label={t("languageSwitcher")}
      className={cn("navigation flex gap-3", className)}
    >
      {locales.map((locale) => (
        <a
          key={locale}
          // @ts-expect-error pathname and params always match: both come from the current route
          href={getPathname({ href: { pathname, params }, locale })}
          hrefLang={locale}
          aria-current={locale === current ? "page" : undefined}
        >
          {locale.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
