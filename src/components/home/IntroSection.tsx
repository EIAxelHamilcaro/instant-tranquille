"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/lib/useReveal";

export function IntroSection({
  introImage,
  introTitle,
  introText,
}: {
  introImage?: any;
  introTitle?: string | null;
  introText?: unknown;
}) {
  const t = useTranslations("home");
  const ref = useReveal();

  const title = introTitle || t("introTitle");
  const hasRichText = introText && typeof introText === "object";

  return (
    <section className="py-20" ref={ref}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal-left">
            <SectionHeading title={title} centered={false} />
            {hasRichText ? (
              <RichTextRenderer
                content={introText}
                className="text-lg leading-relaxed text-foreground/80 prose prose-stone max-w-none"
              />
            ) : (
              <p className="text-lg leading-relaxed text-foreground/80">
                {t("introText")}
              </p>
            )}
            <Button
              asChild
              className="mt-6 bg-primary-500 font-sans text-white hover:bg-primary-600 active:scale-[0.98]"
            >
              <Link href="/le-gite">{t("heroCta")}</Link>
            </Button>
          </div>
          <div className="reveal-right">
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
