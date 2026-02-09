import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";

export function MapPlaceholder() {
  const t = useTranslations("contact");

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("mapTitle")} />
        <div className="mx-auto max-w-4xl">
          <ImagePlaceholder
            aspectRatio="16/9"
            icon="map-pin"
            label="Carte — Sologne, Centre-Val de Loire"
            className="rounded-xl"
          />
        </div>
      </Container>
    </section>
  );
}
