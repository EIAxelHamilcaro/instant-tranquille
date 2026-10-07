"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PlaceCategory } from "@/lib/places";
import { cn } from "@/lib/utils";

interface CategoryStop {
  category: PlaceCategory;
  label: string;
  count?: number;
}

interface CategoryBarProps {
  label: string;
  stops: CategoryStop[];
}

const READING_LINE = "-30% 0px -65% 0px";

export function CategoryBar({ label, stops }: CategoryBarProps) {
  const [current, setCurrent] = useState<PlaceCategory | null>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = stops
      .map(({ category }) => document.getElementById(`categorie-${category}`))
      .filter((section) => section !== null);

    const watcher = new IntersectionObserver(
      (entries) => {
        const reading = entries.find((entry) => entry.isIntersecting);
        if (!reading) return;

        const category = reading.target.id.replace("categorie-", "");
        setCurrent(category as PlaceCategory);
      },
      { rootMargin: READING_LINE },
    );
    for (const section of sections) watcher.observe(section);

    return () => watcher.disconnect();
  }, [stops]);

  useEffect(() => {
    const list = track.current;
    const link = list?.querySelector<HTMLElement>(
      `[href="#categorie-${current}"]`,
    );
    if (!list || !link) return;

    const centered =
      link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left: centered, behavior: "smooth" });
  }, [current]);

  return (
    <nav className="jalons" aria-label={label}>
      <ul ref={track} className="page flex">
        {stops.map(({ category, label: name, count }) => (
          <li key={category}>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("jalon", `categorie-${category}`)}
            >
              <a
                href={`#categorie-${category}`}
                aria-current={current === category ? "true" : undefined}
              >
                {name}
                {count !== undefined && <span className="compte">{count}</span>}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
