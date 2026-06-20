"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
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
  const textRef = useRef<HTMLDivElement>(null);

  const title = introTitle || t("introTitle");
  const hasRichText = introText && typeof introText === "object";

  return (
    <section
      ref={sectionRef}
      className="py-24 overflow-hidden"
      aria-label={title}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-0 lg:grid-cols-[3fr_2fr]">
          {/* Image dominante — 60 % */}
          <div className="reveal-scale relative order-first lg:order-none">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-2xl">
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
            </div>
            {/* Accent décoratif décalé */}
            <div
              className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-full bg-primary-100 opacity-60 hidden lg:block"
              aria-hidden="true"
            />
          </div>

          {/* Bloc texte — 40 %, décalé vers la droite */}
          <div
            ref={textRef}
            className="reveal-left pl-0 lg:pl-14 xl:pl-20 pt-10 lg:pt-0"
          >
            <SectionHeading
              title={title}
              eyebrow={t("introEyebrow")}
              variant="left"
              centered={false}
            />
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
                <p className="text-base leading-relaxed text-foreground/75">
                  {t("introText")}
                </p>
              )}
            </div>
            <div
              className="reveal mt-8"
              style={{ "--stagger": "2" } as React.CSSProperties}
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
