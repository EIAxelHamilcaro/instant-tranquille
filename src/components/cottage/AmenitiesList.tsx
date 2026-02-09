"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";
import type { CmsAmenity } from "@/lib/queries";

const categoryOrder = ["indoor", "outdoor", "kitchen", "comfort"] as const;

function getIcon(iconName: string | null | undefined): LucideIcons.LucideIcon {
  if (!iconName) return LucideIcons.Check;
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  const icon = (LucideIcons as Record<string, unknown>)[pascalCase];
  return (icon as LucideIcons.LucideIcon) || LucideIcons.Check;
}

export function AmenitiesList({ amenities }: { amenities: CmsAmenity[] }) {
  const t = useTranslations("cottage");

  const grouped = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = amenities.filter((a) => a.category === cat);
      return acc;
    },
    {} as Record<string, CmsAmenity[]>,
  );

  const availableCategories = categoryOrder.filter(
    (cat) => grouped[cat]?.length > 0,
  );

  if (!availableCategories.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("amenitiesTitle")} />
        <Tabs
          defaultValue={availableCategories[0]}
          className="mx-auto max-w-3xl"
        >
          <TabsList className="mb-8 grid w-full grid-cols-4 bg-sand-100">
            {categoryOrder.map((key) => (
              <TabsTrigger
                key={key}
                value={key}
                className="font-sans text-sm data-[state=active]:bg-primary-500 data-[state=active]:text-white"
              >
                {t(`amenityCategories.${key}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categoryOrder.map((key) => (
            <TabsContent key={key} value={key}>
              <div className="grid gap-4 sm:grid-cols-2">
                {(grouped[key] || []).map((amenity) => {
                  const Icon = getIcon(amenity.icon);
                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 rounded-lg border border-sand-200 bg-white p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
                        <Icon className="h-5 w-5 text-primary-500" />
                      </div>
                      <span className="font-sans text-sm font-medium">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
}
