"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { CmsRecommendation } from "@/lib/queries";

const MapWithMarkers = dynamic(() => import("./SurroundingsMapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[300px] w-full animate-pulse rounded-xl bg-sand-100 sm:h-[400px] md:h-[480px]"
      aria-hidden="true"
    />
  ),
});

interface SurroundingsMapProps {
  recommendations: CmsRecommendation[];
  giteCoordinates?: { lat?: number | null; lng?: number | null } | null;
}

export function SurroundingsMap({
  recommendations,
  giteCoordinates,
}: SurroundingsMapProps) {
  const t = useTranslations("surroundings");

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("mapTitle")} />
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <MapWithMarkers
            recommendations={recommendations}
            giteCoordinates={giteCoordinates}
          />
        </div>
      </Container>
    </section>
  );
}
