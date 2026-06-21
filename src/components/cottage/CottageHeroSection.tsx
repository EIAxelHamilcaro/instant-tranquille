import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { PayloadImage } from "@/components/shared/PayloadImage";
import type { CmsMedia } from "@/lib/queries";

interface CottageHeroSectionProps {
  heroImage?: CmsMedia | string | number | null;
  title?: string | null;
  eyebrow?: string | null;
}

export function CottageHeroSection({
  heroImage,
  title,
  eyebrow,
}: CottageHeroSectionProps) {
  const t = useTranslations("cottage");

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
              alt={t("heroImageAlt")}
              className="object-cover object-center"
            />
          ) : (
            <ImagePlaceholder aspectRatio="16/9" className="h-full w-full" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#161d14] via-[#161d14]/35 to-[#161d14]/20" />
      </div>

      <Container className="relative z-10 w-full pb-14 pt-28 lg:pb-20">
        <p
          className="data hero-stagger text-xs text-sand-300/90 sm:text-sm"
          style={{ "--reveal-delay": 100 } as React.CSSProperties}
        >
          {eyebrow ?? t("heroEyebrow")}
        </p>
        <h1
          className="hero-stagger display-hero mt-4 font-display font-semibold text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
          style={{ "--reveal-delay": 200 } as React.CSSProperties}
        >
          {title ?? t("title")}
        </h1>
      </Container>
    </section>
  );
}
