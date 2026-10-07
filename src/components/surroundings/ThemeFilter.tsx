"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlaceCategory } from "@/lib/places";
import { cn } from "@/lib/utils";

interface ThemeOption {
  value: PlaceCategory;
  label: string;
  count: number;
}

interface ThemeFilterProps {
  options: ThemeOption[];
  label: string;
  allLabel: string;
  children: React.ReactNode;
}

export function ThemeFilter({
  options,
  label,
  allLabel,
  children,
}: ThemeFilterProps) {
  const [theme, setTheme] = useState<PlaceCategory | null>(null);

  useEffect(() => {
    const select = (hash: string) => {
      const option = options.find(({ value }) => hash === `#theme-${value}`);
      if (option) setTheme(option.value);
    };

    const selectFromLocation = () => select(window.location.hash);

    const selectFromLink = ({ target }: MouseEvent) => {
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href*='#theme-']");
      if (link) select(link.hash);
    };

    selectFromLocation();
    window.addEventListener("hashchange", selectFromLocation);
    document.addEventListener("click", selectFromLink);

    return () => {
      window.removeEventListener("hashchange", selectFromLocation);
      document.removeEventListener("click", selectFromLink);
    };
  }, [options]);

  return (
    <div className="filtre-themes grid gap-10" data-theme={theme ?? undefined}>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="pastille pastille-ronde"
          aria-pressed={theme === null}
          onClick={() => setTheme(null)}
        >
          {allLabel}
        </Button>
        {options.map((option) => (
          <Button
            key={option.value}
            id={`theme-${option.value}`}
            variant="outline"
            size="sm"
            className={cn(
              "pastille pastille-ronde",
              `categorie-${option.value}`,
            )}
            aria-pressed={theme === option.value}
            onClick={() =>
              setTheme(theme === option.value ? null : option.value)
            }
          >
            {option.label}
            <span className="compte">{option.count}</span>
          </Button>
        ))}
      </div>
      {children}
    </div>
  );
}
