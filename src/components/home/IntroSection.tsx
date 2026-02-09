import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";

export function IntroSection({ introImage }: { introImage?: any }) {
  const t = useTranslations("home");

  return (
    <section className="py-20">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title={t("introTitle")} centered={false} />
            <p className="text-lg leading-relaxed text-foreground/80">
              {t("introText")}
            </p>
          </div>
          <div>
            {introImage && typeof introImage === "object" ? (
              <PayloadImage
                media={introImage}
                size="card"
                alt="Vue extérieure du gîte"
                className="rounded-xl"
              />
            ) : (
              <ImagePlaceholder
                aspectRatio="4/3"
                icon="home"
                label="Vue extérieure du gîte"
                className="rounded-xl"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
