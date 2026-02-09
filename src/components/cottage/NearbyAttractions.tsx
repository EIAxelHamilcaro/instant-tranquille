"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import type { CmsRecommendation } from "@/lib/queries";
import { useReveal } from "@/lib/useReveal";

const categoryLabels: Record<string, string> = {
  restaurants: "Restaurant",
  castles: "Château",
  nature: "Nature",
  markets: "Marché",
  activities: "Activité",
  services: "Service",
};

export function NearbyAttractions({
  recommendations,
}: {
  recommendations: CmsRecommendation[];
}) {
  const t = useTranslations("cottage");
  const ref = useReveal();

  if (!recommendations.length) return null;

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <SectionHeading title={t("nearbyTitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recommendations.map((rec, i) => (
            <Card
              key={rec.id}
              className="reveal-scale overflow-hidden border-sand-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ "--stagger": i } as React.CSSProperties}
            >
              {rec.photo && typeof rec.photo === "object" ? (
                <PayloadImage
                  media={rec.photo}
                  size="card"
                  alt={rec.name}
                  className="rounded-none"
                />
              ) : (
                <ImagePlaceholder
                  aspectRatio="16/9"
                  icon="map-pin"
                  label={rec.name}
                  className="rounded-none border-0"
                />
              )}
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-primary-50 text-primary-700"
                  >
                    {categoryLabels[rec.category] || rec.category}
                  </Badge>
                  {rec.distanceFromGite && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {rec.distanceFromGite}
                    </span>
                  )}
                </div>
                <h3 className="font-heading text-base font-semibold">
                  {rec.name}
                </h3>
                {typeof rec.description === "string" && rec.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
