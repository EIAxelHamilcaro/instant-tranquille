import { useTranslations } from "next-intl";
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
    <section className="relative flex h-[45vh] min-h-64 items-end overflow-hidden bg-primary-900">
      {hasImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            media={heroImage}
            size="hero"
            fill
            priority
            alt={t("heroTitle")}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-primary-900/30 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <ImagePlaceholder
            aspectRatio="16/9"
            icon="trees"
            className="h-full w-full rounded-none border-0 bg-primary-800"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950/75 via-primary-900/30 to-transparent" />
        </div>
      )}

      <div className="relative z-10 w-full pb-10 pl-6 sm:pl-12 lg:pl-20">
        {(eyebrow ?? t("eyebrow")) && (
          <p className="subtitle-editorial mb-2 text-sm tracking-widest text-sand-300 drop-shadow-sm sm:text-base">
            {eyebrow ?? t("eyebrow")}
          </p>
        )}
        <p className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
          {title ?? t("heroTitle")}
        </p>
        {(subtitle ?? t("heroSubtitle")) && (
          <p className="subtitle-editorial mt-3 max-w-xl text-base text-sand-200 drop-shadow-sm sm:text-lg">
            {subtitle ?? t("heroSubtitle")}
          </p>
        )}
      </div>
    </section>
  );
}
