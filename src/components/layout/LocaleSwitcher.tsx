"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    router.replace(pathname as "/", { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-sand-300 p-0.5 font-sans text-sm" role="group" aria-label="Langue">
      <button
        onClick={() => switchLocale("fr")}
        aria-current={locale === "fr" ? "true" : undefined}
        className={cn(
          "rounded-full px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
          locale === "fr"
            ? "bg-primary-500 text-white"
            : "text-foreground hover:bg-sand-100",
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale("en")}
        aria-current={locale === "en" ? "true" : undefined}
        className={cn(
          "rounded-full px-3 py-2.5 transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
          locale === "en"
            ? "bg-primary-500 text-white"
            : "text-foreground hover:bg-sand-100",
        )}
      >
        EN
      </button>
    </div>
  );
}
