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
      className="relative overflow-hidden"
      aria-label={title}
    >
      <div className="relative mx-auto max-w-7xl">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 right-[calc(50%_-_50vw)] bg-sand-100 lg:left-[60%]"
          aria-hidden="true"
        />
        <div className="grid items-stretch lg:grid-cols-[3fr_2fr]">
          <div className="reveal-scale relative order-first lg:order-none">
            <div className="relative aspect-[4/3] overflow-hidden lg:absolute lg:inset-0 lg:-top-16 lg:-bottom-16 lg:aspect-auto">
              {introImage && typeof introImage === "object" ? (
                <PayloadImage
                  media={
                    introImage as Parameters<typeof PayloadImage>[0]["media"]
                  }
                  size="hero"
                  alt={t("introImageAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <ImagePlaceholder
                  aspectRatio="4/3"
                  icon="home"
                  label={t("introImageAlt")}
                  className="h-full w-full"
                />
              )}
              <div
                className="absolute inset-y-0 right-0 hidden w-1 bg-primary-500 lg:block"
                aria-hidden="true"
              />
            </div>
            <div
              className="hidden lg:block lg:min-h-[480px]"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-16 lg:py-24 lg:pl-16 lg:pr-8 xl:pl-20">
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
                  className="prose prose-stone max-w-none text-base leading-relaxed text-foreground/75"
                />
              ) : (
                <p className="max-w-prose text-base leading-relaxed text-foreground/75">
                  {t("introText")}
                </p>
              )}
            </div>

            <div
              className="reveal mt-8 flex flex-col gap-2 border-l-2 border-primary-300 pl-4 text-sm text-muted-foreground"
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
                className="border-primary-500 font-sans font-semibold text-primary-600 hover:bg-primary-50 hover:text-primary-700 active:scale-[0.98]"
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
