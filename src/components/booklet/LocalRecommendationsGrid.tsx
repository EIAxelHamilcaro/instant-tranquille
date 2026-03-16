"use client";

import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Star, MapPin, Phone, ExternalLink } from "lucide-react";
import type { NormalizedRecommendation } from "@/lib/booklet-utils";

type Recommendation = NormalizedRecommendation;

const categories = [
  { value: "restaurants", labelKey: "categoryRestaurants" },
  { value: "castles", labelKey: "categoryCastles" },
  { value: "nature", labelKey: "categoryNature" },
  { value: "activities", labelKey: "categoryActivities" },
  { value: "markets", labelKey: "categoryMarkets" },
  { value: "services", labelKey: "categoryServices" },
] as const;

export function LocalRecommendationsGrid({
  id,
  sectionTitle,
  recommendations,
}: {
  id?: string;
  sectionTitle?: string | null;
  recommendations: Recommendation[];
}) {
  const t = useTranslations("booklet");

  if (!recommendations?.length) return null;

  const grouped = categories.reduce(
    (acc, cat) => {
      acc[cat.value] = recommendations.filter(
        (r) => r.category === cat.value,
      );
      return acc;
    },
    {} as Record<string, Recommendation[]>,
  );

  const nonEmptyCategories = categories.filter(
    (c) => grouped[c.value]?.length > 0,
  );

  return (
    <section id={id ?? "recommendations"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Star className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("recommendations")}
      </h2>

      {nonEmptyCategories.length > 0 ? (
        <Tabs defaultValue={nonEmptyCategories[0].value}>
          <TabsList className="mb-6 bg-sand-100">
            {nonEmptyCategories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="font-sans text-sm data-[state=active]:bg-primary-500 data-[state=active]:text-white"
              >
                {t(cat.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>

          {nonEmptyCategories.map((cat) => (
            <TabsContent key={cat.value} value={cat.value}>
              <div className="grid gap-4 sm:grid-cols-2">
                {grouped[cat.value].map((rec) => (
                  <Card key={rec.name} className="border-sand-200">
                    <CardContent className="p-4">
                      <h4 className="font-heading text-base font-semibold">
                        {rec.name}
                      </h4>
                      {rec.distanceFromGite && (
                        <Badge
                          variant="secondary"
                          className="mt-1 bg-sand-100"
                        >
                          <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
                          {rec.distanceFromGite}
                        </Badge>
                      )}
                      {rec.richDescription ? (
                        <div className="mt-2 text-sm text-foreground/80">
                          <RichTextRenderer content={rec.richDescription as Record<string, unknown>} />
                        </div>
                      ) : rec.description ? (
                        <p className="mt-2 text-sm text-foreground/80">
                          {rec.description}
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {rec.phone && (
                          <a
                            href={`tel:${rec.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-1 hover:text-primary-600"
                          >
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            {rec.phone}
                          </a>
                        )}
                        {rec.website && (
                          <a
                            href={rec.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary-600"
                          >
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            {t("websiteLabel")}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <p className="text-muted-foreground">{t("noRecommendations")}</p>
      )}
    </section>
  );
}
