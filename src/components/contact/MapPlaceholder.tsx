"use client";

import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { GoogleMap } from "@/components/shared/GoogleMap";
import { SectionHeading } from "@/components/shared/SectionHeading";

export interface MapSectionProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  markerLabel?: string | null;
}

export function MapSection({ lat, lng, zoom }: MapSectionProps) {
  const t = useTranslations("contact");
  const locale = useLocale();

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("mapTitle")} />
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-sm">
          <GoogleMap
            lat={lat}
            lng={lng}
            zoom={zoom}
            locale={locale}
            title={t("mapTitle")}
          />
        </div>
      </Container>
    </section>
  );
}
