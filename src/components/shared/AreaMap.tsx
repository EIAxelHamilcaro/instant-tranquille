"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card } from "@/components/ui/card";

interface AreaMapProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number;
  title?: string;
}

export function AreaMap({ lat, lng, zoom = 12, title }: AreaMapProps) {
  const t = useTranslations("cottage");
  const locale = useLocale();

  const latitude = lat ?? 47.4833;
  const longitude = lng ?? 1.7667;

  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed&hl=${locale}`;

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={title || t("nearbyTitle")} />
        <Card className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-sm">
          <iframe
            src={src}
            width="100%"
            className="h-[250px] sm:h-[350px] md:h-[450px]"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title || t("nearbyTitle")}
          />
        </Card>
      </Container>
    </section>
  );
}
