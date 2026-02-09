"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

export interface MapSectionProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  markerLabel?: string | null;
}

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-xl bg-sand-200" />
  ),
});

export function MapSection({ lat, lng, zoom, markerLabel }: MapSectionProps) {
  const t = useTranslations("contact");

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("mapTitle")} />
        <div className="mx-auto max-w-4xl">
          <MapClient lat={lat} lng={lng} zoom={zoom} markerLabel={markerLabel} />
        </div>
      </Container>
    </section>
  );
}
