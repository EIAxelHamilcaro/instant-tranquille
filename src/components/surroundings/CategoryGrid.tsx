"use client";

import {
  Castle,
  ExternalLink,
  MapPin,
  Navigation,
  ShoppingBasket,
  Ticket,
  Trees,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import type { CmsRecommendation } from "@/lib/queries";
import { useReveal } from "@/lib/useReveal";

const categoryConfig: Record<
  string,
  { icon: typeof Castle; color: string; bg: string }
> = {
  castles: { icon: Castle, color: "text-earth-700", bg: "bg-earth-100" },
  restaurants: {
    icon: UtensilsCrossed,
    color: "text-earth-700",
    bg: "bg-earth-100",
  },
  nature: { icon: Trees, color: "text-primary-700", bg: "bg-primary-100" },
  activities: { icon: Ticket, color: "text-primary-700", bg: "bg-primary-100" },
  markets: {
    icon: ShoppingBasket,
    color: "text-earth-700",
    bg: "bg-earth-100",
  },
  services: { icon: Wrench, color: "text-foreground", bg: "bg-sand-200" },
};

interface CategoryGridProps {
  recommendations: CmsRecommendation[];
}

export function CategoryGrid({ recommendations }: CategoryGridProps) {
  const t = useTranslations("surroundings");
  const ref = useReveal();

  const nonEquestrian = recommendations.filter(
    (r) => r.category !== "equestrian",
  );

  if (!nonEquestrian.length) return null;

  return (
    <section className="py-20" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title={t("categoryTitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {nonEquestrian.map((rec, i) => {
            const cat = categoryConfig[rec.category] ?? categoryConfig.services;
            const CatIcon = cat.icon;
            const catLabel =
              t(`categories.${rec.category}` as Parameters<typeof t>[0], {
                fallback: rec.category,
              }) ?? rec.category;
            const desc =
              typeof rec.description === "string" &&
              !rec.description.startsWith('{"root"')
                ? rec.description
                : null;

            return (
              <article
                key={rec.id}
                className="reveal-scale group relative overflow-hidden rounded-xl border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sand-200/60"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {rec.photo && typeof rec.photo === "object" ? (
                    <PayloadImage
                      media={rec.photo}
                      size="card"
                      alt={rec.name}
                      className="rounded-none transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder
                      aspectRatio="16/10"
                      icon="map-pin"
                      label={rec.name}
                      className="rounded-none border-0"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3">
                    <Badge
                      className={`${cat.bg} ${cat.color} gap-1.5 font-semibold shadow-sm backdrop-blur-sm`}
                    >
                      <CatIcon className="h-3 w-3" aria-hidden="true" />
                      {catLabel}
                    </Badge>
                  </div>
                  {rec.distanceFromGite && (
                    <div className="absolute bottom-3 right-3">
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-white/90 text-foreground shadow-sm backdrop-blur-sm"
                      >
                        <Navigation
                          className="h-3 w-3 text-primary-500"
                          aria-hidden="true"
                        />
                        {rec.distanceFromGite}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
                    {rec.name}
                  </h3>
                  {desc && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  )}
                  {(rec.address || rec.website) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-sand-100 pt-3">
                      {rec.address && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin
                            className="h-3 w-3 shrink-0 text-sand-400"
                            aria-hidden="true"
                          />
                          <span className="truncate">{rec.address}</span>
                        </span>
                      )}
                      {rec.website && (
                        <a
                          href={rec.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700"
                        >
                          <ExternalLink
                            className="h-3 w-3 shrink-0"
                            aria-hidden="true"
                          />
                          {t("website")}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
