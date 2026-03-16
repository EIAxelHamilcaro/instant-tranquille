"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    router.replace(
      // @ts-expect-error — dynamic pathname with params
      { pathname, params },
      { locale: newLocale },
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-sand-300 p-0.5 font-sans text-sm" role="group" aria-label={t("languageSwitcher")}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale("fr")}
        aria-current={locale === "fr" ? "true" : undefined}
        className={cn(
          "rounded-full px-3 py-2.5",
          locale === "fr"
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "text-foreground hover:bg-sand-100",
        )}
      >
        FR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale("en")}
        aria-current={locale === "en" ? "true" : undefined}
        className={cn(
          "rounded-full px-3 py-2.5",
          locale === "en"
            ? "bg-primary-500 text-white hover:bg-primary-600"
            : "text-foreground hover:bg-sand-100",
        )}
      >
        EN
      </Button>
    </div>
  );
}
