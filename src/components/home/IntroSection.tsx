"use client";

import { useTranslations } from "next-intl";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/lib/useReveal";

interface IntroSectionProps {
  introImage?: Record<string, unknown> | string | number | null;
  introTitle?: string | null;
  introText?: unknown;
}

export function IntroSection({
  introImage,
  introTitle,
  introText,
}: IntroSectionProps) {
  const t = useTranslations("home");
  const sectionRef = useReveal<HTMLElement>();

  const title = introTitle || t("introTitle");
  const hasRichText = introText && typeof introText === "object";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-0"
      aria-label={title}
    >
      {/* Fond crème décalé — occupe la moitié droite */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-2/5 bg-sand-100"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[3fr_2fr] items-stretch">
          {/* Image dominante — 60 % — déborde en haut et en bas */}
          <div className="reveal-scale relative order-first lg:order-none">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:absolute lg:inset-0 lg:-top-16 lg:-bottom-16 overflow-hidden">
              {introImage && typeof introImage === "object" ? (
                <PayloadImage
                  media={
                    introImage as Parameters<typeof PayloadImage>[0]["media"]
                  }
                  size="card"
                  alt={t("introImageAlt")}
                  fill
                  className="object-cover"
                />
              ) : (
                <ImagePlaceholder
                  aspectRatio="4/3"
                  icon="home"
                  label={t("introImageAlt")}
                  className="h-full w-full"
                />
              )}
              {/* Bordure accent vert sur le bord droit de l'image */}
              <div
                className="absolute inset-y-0 right-0 w-1 bg-primary-500 hidden lg:block"
                aria-hidden="true"
              />
            </div>
            {/* Espace réservé mobile (l'image est en absolute sur desktop) */}
            <div
              className="hidden lg:block lg:min-h-[480px]"
              aria-hidden="true"
            />
          </div>

          {/* Bloc texte — 40 % — décalé verticalement */}
          <div className="flex flex-col justify-center px-6 py-16 lg:py-24 lg:pl-16 xl:pl-20 lg:pr-8">
            <div
              className="reveal-left"
              style={{ "--stagger": "0" } as React.CSSProperties}
            >
              <SectionHeading
                title={title}
                eyebrow={t("introEyebrow")}
                variant="left"
                centered={false}
              />
            </div>

            <div
              className="reveal space-y-4"
              style={{ "--stagger": "1" } as React.CSSProperties}
            >
              {hasRichText ? (
                <RichTextRenderer
                  content={introText}
                  className="text-base leading-relaxed text-foreground/75 prose prose-stone max-w-none"
                />
              ) : (
                <p className="text-base leading-relaxed text-foreground/75 max-w-prose">
                  {t("introText")}
                </p>
              )}
            </div>

            {/* Bloc distances — sobre, factuel */}
            <div
              className="reveal mt-8 flex flex-col gap-2 text-sm text-muted-foreground border-l-2 border-primary-300 pl-4"
              style={{ "--stagger": "2" } as React.CSSProperties}
            >
              <span>{t("introDistChambord")}</span>
              <span>{t("introDistGrandParquet")}</span>
            </div>

            <div
              className="reveal mt-8"
              style={{ "--stagger": "3" } as React.CSSProperties}
            >
              <Button
                asChild
                variant="outline"
                className="border-primary-500 text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:scale-[0.98] font-sans font-semibold"
              >
                <Link href="/le-gite">{t("heroCta2")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
