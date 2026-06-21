import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PayloadImage } from "@/components/shared/PayloadImage";
import type { CmsMedia } from "@/lib/queries";

interface SurroundingsHeroProps {
  heroImage?: CmsMedia | string | number | null;
  title?: string | null;
  subtitle?: string | null;
  eyebrow?: string | null;
}

export function SurroundingsHero({
  heroImage,
  title,
  subtitle,
  eyebrow,
}: SurroundingsHeroProps) {
  const t = useTranslations("surroundings");

  const hasImage =
    heroImage && typeof heroImage === "object" && (heroImage as CmsMedia).url;

  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-[#161d14]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-reveal absolute inset-0">
          {hasImage ? (
            <PayloadImage
              media={heroImage}
              size="hero"
              fill
              priority
              alt={t("heroTitle")}
              className="object-cover object-center"
            />
          ) : (
            <ImagePlaceholder
              aspectRatio="16/9"
              icon="trees"
              className="h-full w-full rounded-none border-0 bg-primary-800"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#161d14] via-[#161d14]/35 to-[#161d14]/20" />
      </div>

      <Container className="relative z-10 w-full pb-14 pt-28 lg:pb-20">
        <p
          className="data hero-stagger text-xs text-sand-300/90 sm:text-sm"
          style={{ "--reveal-delay": 100 } as React.CSSProperties}
        >
          {eyebrow ?? t("eyebrow")}
        </p>
        <p
          className="hero-stagger display-hero mt-4 font-display font-semibold text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
          style={{ "--reveal-delay": 200 } as React.CSSProperties}
        >
          {title ?? t("heroTitle")}
        </p>
        {(subtitle ?? t("heroSubtitle")) && (
          <p
            className="subtitle-editorial hero-stagger mt-4 max-w-xl text-base text-sand-100/95 drop-shadow-md sm:text-lg"
            style={{ "--reveal-delay": 320 } as React.CSSProperties}
          >
            {subtitle ?? t("heroSubtitle")}
          </p>
        )}
      </Container>
    </section>
  );
}
