"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
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

type PreviewImage = {
  image?: any;
  label?: string | null;
};

export function DescriptionSection({
  propertyDetails,
  descriptionTitle,
  descriptionText,
  previewImages,
}: {
  propertyDetails?: PropertyDetails | null;
  descriptionTitle?: string | null;
  descriptionText?: unknown;
  previewImages?: PreviewImage[] | null;
}) {
  const t = useTranslations("cottage");
  const tRates = useTranslations("rates");
  const ref = useReveal();

  const title = descriptionTitle || t("descriptionTitle");
  const hasRichText = descriptionText && typeof descriptionText === "object";

  const stats = [
    propertyDetails?.maxGuests != null
      ? { icon: Users, value: String(propertyDetails.maxGuests), label: t("guests") }
      : null,
    propertyDetails?.bedrooms != null
      ? { icon: BedDouble, value: String(propertyDetails.bedrooms), label: t("bedrooms") }
      : null,
    propertyDetails?.bathrooms != null
      ? { icon: Bath, value: String(propertyDetails.bathrooms), label: t("bathrooms") }
      : null,
    propertyDetails?.surface != null
      ? { icon: Maximize, value: `${propertyDetails.surface}m²`, label: t("surface") }
      : null,
  ].filter(Boolean) as { icon: typeof Users; value: string; label: string }[];

  const hasCmsImages = previewImages && previewImages.length > 0;

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="reveal-left">
            <SectionHeading title={title} centered={false} as="h1" />
            {hasRichText ? (
              <RichTextRenderer
                content={descriptionText}
                className="text-lg leading-relaxed text-foreground/80 prose prose-stone max-w-none"
              />
            ) : (
              <p className="text-lg leading-relaxed text-foreground/80">
                {t("descriptionText")}
              </p>
            )}
            <Button
              asChild
              className="mt-6 bg-primary-500 font-sans text-white hover:bg-primary-600 active:scale-[0.98]"
            >
              <Link href="/tarifs-reservation">{tRates("title")}</Link>
            </Button>
            {stats.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="rounded-lg bg-sand-100 p-4 text-center"
                  >
                    <Icon className="mx-auto mb-2 h-6 w-6 text-primary-500" aria-hidden="true" />
                    <p className="font-heading text-2xl font-bold text-foreground">
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="reveal-right space-y-4">
            {hasCmsImages ? (
              <>
                {previewImages[0] && (
                  <PayloadImage
                    media={previewImages[0].image}
                    size="card"
                    alt={previewImages[0].label || t("cottageView")}
                    className="rounded-xl w-full"
                  />
                )}
                {previewImages.length > 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    {previewImages.slice(1).map((item, i) => (
                      <PayloadImage
                        key={i}
                        media={item.image}
                        size="thumbnail"
                        alt={item.label || t("cottageView")}
                        className="rounded-lg w-full"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <ImagePlaceholder
                  aspectRatio="4/3"
                  icon="home"
                  label={t("placeholderLiving")}
                  className="rounded-xl"
                />
                <div className="grid grid-cols-2 gap-4">
                  <ImagePlaceholder
                    aspectRatio="1"
                    icon="bed"
                    label={t("placeholderBedroom")}
                    className="rounded-lg"
                  />
                  <ImagePlaceholder
                    aspectRatio="1"
                    icon="trees"
                    label={t("placeholderGarden")}
                    className="rounded-lg"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
