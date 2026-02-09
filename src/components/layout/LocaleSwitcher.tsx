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
    <div className="flex items-center gap-1 rounded-full border border-sand-300 p-0.5 font-sans text-sm">
      <button
        onClick={() => switchLocale("fr")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
          locale === "fr"
            ? "bg-primary-500 text-white"
            : "text-foreground hover:bg-sand-100",
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition-colors",
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
