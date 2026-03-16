"use client";

import { useTranslations } from "next-intl";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { Map } from "lucide-react";

export function MapSection({
  id,
  sectionTitle,
  embedUrl,
  address,
}: {
  id?: string;
  sectionTitle?: string | null;
  embedUrl?: string | null;
  address?: string | null;
}) {
  const t = useTranslations("booklet");

  return (
    <section id={id ?? "map"} className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Map className="h-6 w-6 text-primary-500" aria-hidden="true" />
        {sectionTitle || t("map")}
      </h2>

      {embedUrl ? (
        <div className="overflow-hidden rounded-xl">
          <iframe
            src={embedUrl}
            className="h-[250px] w-full border-0 sm:h-[350px] md:h-[400px]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={sectionTitle || t("map")}
          />
        </div>
      ) : (
        <ImagePlaceholder
          aspectRatio="16/9"
          icon="map-pin"
          label={t("interactiveMap")}
          className="rounded-xl"
        />
      )}

      {address && (
        <p className="mt-4 text-sm text-muted-foreground">{address}</p>
      )}
    </section>
  );
}
