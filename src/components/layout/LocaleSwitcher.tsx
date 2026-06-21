"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ overlay = false }: { overlay?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    router.replace(
      // @ts-expect-error, dynamic pathname with params
      { pathname, params },
      { locale: newLocale },
    );
  }

  const locales = ["fr", "en"] as const;

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-full border p-0.5 font-sans text-sm transition-colors duration-500",
        overlay ? "border-white/40" : "border-sand-300",
      )}
      aria-label={t("languageSwitcher")}
    >
      {locales.map((code) => {
        const active = locale === code;
        return (
          <Button
            key={code}
            variant="ghost"
            size="sm"
            onClick={() => switchLocale(code)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-3 py-2.5",
              active
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : overlay
                  ? "text-white hover:bg-white/15"
                  : "text-foreground hover:bg-sand-100",
            )}
          >
            {code.toUpperCase()}
          </Button>
        );
      })}
    </nav>
  );
}
