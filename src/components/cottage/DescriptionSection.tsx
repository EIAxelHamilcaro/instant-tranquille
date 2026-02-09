"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Users, BedDouble, Bath, Maximize } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

type PropertyDetails = {
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
};

export function DescriptionSection({
  propertyDetails,
}: {
  propertyDetails?: PropertyDetails | null;
}) {
  const t = useTranslations("cottage");
  const tRates = useTranslations("rates");
  const ref = useReveal();

  const stats = [
    {
      icon: Users,
      value: propertyDetails?.maxGuests ? String(propertyDetails.maxGuests) : "6",
      label: "voyageurs",
    },
    {
      icon: BedDouble,
      value: propertyDetails?.bedrooms ? String(propertyDetails.bedrooms) : "3",
      label: "chambres",
    },
    {
      icon: Bath,
      value: propertyDetails?.bathrooms ? String(propertyDetails.bathrooms) : "2",
      label: "salles de bain",
    },
    {
      icon: Maximize,
      value: propertyDetails?.surface ? `${propertyDetails.surface}m²` : "120m²",
      label: "surface",
    },
  ];

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="reveal-left">
            <SectionHeading title={t("descriptionTitle")} centered={false} as="h1" />
            <p className="text-lg leading-relaxed text-foreground/80">
              {t("descriptionText")}
            </p>
            <Button
              asChild
              className="mt-6 bg-primary-500 font-sans text-white hover:bg-primary-600 active:scale-[0.98]"
            >
              <Link href="/tarifs-reservation">{tRates("title")}</Link>
            </Button>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-lg bg-sand-100 p-4 text-center"
                >
                  <Icon className="mx-auto mb-2 h-6 w-6 text-primary-500" />
                  <p className="font-heading text-2xl font-bold text-foreground">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right space-y-4">
            <ImagePlaceholder
              aspectRatio="4/3"
              icon="home"
              label="Salon principal"
              className="rounded-xl"
            />
            <div className="grid grid-cols-2 gap-4">
              <ImagePlaceholder
                aspectRatio="1"
                icon="bed"
                label="Chambre"
                className="rounded-lg"
              />
              <ImagePlaceholder
                aspectRatio="1"
                icon="trees"
                label="Jardin"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
