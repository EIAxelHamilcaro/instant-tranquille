import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";

export function FloorPlanSection() {
  const t = useTranslations("cottage");

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("floorPlanTitle")} />
        <div className="mx-auto max-w-4xl">
          <ImagePlaceholder
            aspectRatio="16/9"
            icon="home"
            label="Plan du gîte"
            className="rounded-xl"
          />
        </div>
      </Container>
    </section>
  );
}
