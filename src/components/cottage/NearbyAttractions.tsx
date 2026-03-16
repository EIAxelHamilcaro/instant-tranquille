"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import {
  MapPin,
  Phone,
  ExternalLink,
  Castle,
  UtensilsCrossed,
  Trees,
  Ticket,
  ShoppingBasket,
  Wrench,
  Navigation,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CmsRecommendation } from "@/lib/queries";
import { useReveal } from "@/lib/useReveal";

const categoryConfig: Record<string, { icon: typeof Castle; color: string; bg: string }> = {
  castles:     { icon: Castle,            color: "text-amber-700",  bg: "bg-amber-50" },
  restaurants: { icon: UtensilsCrossed,   color: "text-rose-700",   bg: "bg-rose-50" },
  nature:      { icon: Trees,             color: "text-emerald-700", bg: "bg-emerald-50" },
  activities:  { icon: Ticket,            color: "text-violet-700", bg: "bg-violet-50" },
  markets:     { icon: ShoppingBasket,    color: "text-yellow-700", bg: "bg-yellow-50" },
  services:    { icon: Wrench,            color: "text-slate-600",  bg: "bg-slate-50" },
};

export function NearbyAttractions({
  recommendations,
}: {
  recommendations: CmsRecommendation[];
}) {
  const t = useTranslations("cottage");
  const tBooklet = useTranslations("booklet");
  const ref = useReveal();

  const categoryLabels: Record<string, string> = {
    restaurants: tBooklet("categoryRestaurants"),
    castles: tBooklet("categoryCastles"),
    nature: tBooklet("categoryNature"),
    markets: tBooklet("categoryMarkets"),
    activities: tBooklet("categoryActivities"),
    services: tBooklet("categoryServices"),
  };

  if (!recommendations?.length) return null;

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <SectionHeading title={t("nearbyTitle")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, i) => {
            const cat = categoryConfig[rec.category] || categoryConfig.services;
            const CatIcon = cat.icon;
            const desc = typeof rec.description === "string" && !rec.description.startsWith('{"root"')
              ? rec.description
              : null;

            return (
              <article
                key={rec.id}
                className="reveal-scale group relative overflow-hidden rounded-xl border border-sand-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sand-200/60"
                style={{ "--stagger": i } as React.CSSProperties}
              >
                {/* Image */}
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
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Category pill — floating on image */}
                  <div className="absolute left-3 top-3">
                    <Badge className={`${cat.bg} ${cat.color} gap-1.5 font-semibold shadow-sm backdrop-blur-sm`}>
                      <CatIcon className="h-3 w-3" aria-hidden="true" />
                      {categoryLabels[rec.category] || rec.category}
                    </Badge>
                  </div>

                  {/* Distance — floating bottom-right */}
                  {rec.distanceFromGite && (
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="gap-1 bg-white/90 text-foreground shadow-sm backdrop-blur-sm">
                        <Navigation className="h-3 w-3 text-primary-500" aria-hidden="true" />
                        {rec.distanceFromGite}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-heading text-lg font-semibold leading-tight text-foreground">
                    {rec.name}
                  </h3>

                  {desc && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {desc}
                    </p>
                  )}

                  {/* Meta row — phone, website, address */}
                  {(rec.phone || rec.website || rec.address) && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-sand-100 pt-3">
                      {rec.address && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0 text-sand-400" aria-hidden="true" />
                          <span className="truncate">{rec.address}</span>
                        </span>
                      )}
                      {rec.phone && (
                        <a
                          href={`tel:${rec.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700"
                        >
                          <Phone className="h-3 w-3 shrink-0" aria-hidden="true" />
                          {rec.phone}
                        </a>
                      )}
                      {rec.website && (
                        <a
                          href={rec.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary-600 transition-colors hover:text-primary-700"
                        >
                          <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                          {tBooklet("websiteLabel")}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
