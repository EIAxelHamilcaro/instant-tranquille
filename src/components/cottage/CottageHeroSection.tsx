import { useTranslations } from "next-intl";
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
    <section className="relative flex h-[45vh] min-h-64 items-end overflow-hidden bg-primary-900">
      {hasImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            media={heroImage}
            size="hero"
            fill
            priority
            alt={t("heroImageAlt")}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-primary-900/30 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <ImagePlaceholder aspectRatio="16/9" className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-primary-900/30 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full pb-10 pl-6 sm:pl-12 lg:pl-20">
        {(eyebrow ?? t("heroEyebrow")) && (
          <p className="subtitle-editorial mb-2 text-sm tracking-widest text-sand-300 drop-shadow-sm sm:text-base">
            {eyebrow ?? t("heroEyebrow")}
          </p>
        )}
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          {title ?? t("title")}
        </h1>
      </div>
    </section>
  );
}
