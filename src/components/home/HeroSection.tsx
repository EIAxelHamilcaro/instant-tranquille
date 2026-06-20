import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type MediaObject = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  blurDataURL?: string | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
    hero?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    } | null;
  } | null;
};

type HeroImageItem = { image?: MediaObject | string | number | null };

interface HeroSectionProps {
  heroImage?: Record<string, unknown> | string | number | null;
  heroImages?: HeroImageItem[] | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    abritel?: string | null;
    email?: string | null;
  } | null;
}

export function HeroSection({
  heroImage,
  heroImages,
  heroTitle,
  heroSubtitle,
  bookingLinks,
}: HeroSectionProps) {
  const t = useTranslations("home");

  const title = heroTitle || t("heroTitle");
  const subtitle = heroSubtitle || t("heroSubtitle");

  const reservationHref =
    bookingLinks?.airbnb ||
    bookingLinks?.booking ||
    bookingLinks?.abritel ||
    (bookingLinks?.email ? `mailto:${bookingLinks.email}` : null) ||
    "/tarifs-reservation";

  const isExternal =
    reservationHref.startsWith("http") || reservationHref.startsWith("mailto");

  // Extraire les médias de heroImages (max 3)
  const mosaicMedias: Array<MediaObject | string | number> = [];
  if (heroImages && heroImages.length > 0) {
    for (const item of heroImages.slice(0, 3)) {
      if (item.image != null) {
        mosaicMedias.push(item.image as MediaObject | string | number);
      }
    }
  }

  // Fallback : si pas de heroImages, utiliser heroImage
  const legacyMedia = mosaicMedias.length === 0 && heroImage ? heroImage : null;

  // Mosaïque = au moins 3 médias valides
  const useMosaic = mosaicMedias.length >= 3;
  const mainMedia = mosaicMedias[0];
  const secondMedia = mosaicMedias[1];
  const thirdMedia = mosaicMedias[2];

  // Image unique (legacy ou moins de 3)
  const soloMedia = useMosaic ? null : (mosaicMedias[0] ?? legacyMedia ?? null);

  const hasSoloImage =
    soloMedia &&
    (typeof soloMedia === "object" ? (soloMedia as MediaObject).url : false);

  if (useMosaic) {
    // ── Mosaïque 3 photos ────────────────────────────────────────────────────
    return (
      <section
        className="relative flex min-h-dvh flex-col overflow-hidden bg-[#1a2318] lg:flex-row"
        aria-label={t("heroEyebrow")}
      >
        {/* Colonne gauche : grande photo portrait (col 7/12) */}
        <div className="relative h-[55vw] w-full lg:h-auto lg:w-7/12">
          <PayloadImage
            media={mainMedia as Parameters<typeof PayloadImage>[0]["media"]}
            size="hero"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2318]/30 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>

        {/* Colonne droite : 2 photos paysage empilées + panneau texte (col 5/12) */}
        <div className="flex w-full flex-col lg:w-5/12">
          {/* Photo 2 — salon cheminée */}
          <div className="relative h-[35vw] lg:h-1/2">
            <PayloadImage
              media={secondMedia as Parameters<typeof PayloadImage>[0]["media"]}
              size="card"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a2318]/20" />
          </div>

          {/* Photo 3 — cuisine */}
          <div className="relative h-[35vw] lg:h-1/2">
            <PayloadImage
              media={thirdMedia as Parameters<typeof PayloadImage>[0]["media"]}
              size="card"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2318]/40 to-transparent" />
          </div>
        </div>

        {/* Panneau texte superposé — desktop: absolu sur la jonction; mobile: bandeau sobre en bas */}
        <div className="relative z-20 w-full bg-[#1a2318]/90 px-6 py-10 backdrop-blur-sm lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-auto lg:max-w-xl lg:flex-col lg:items-start lg:justify-center lg:bg-gradient-to-r lg:from-[#1a2318]/80 lg:via-[#1a2318]/60 lg:to-transparent lg:px-12 lg:py-0 lg:backdrop-blur-none">
          <p className="mb-4 font-serif text-sm italic tracking-widest text-[#d4c097]/80 lg:text-base">
            {t("heroEyebrow")}
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h1>
          <p className="subtitle-editorial mt-4 text-lg leading-relaxed text-[#e8dfc8] drop-shadow-md sm:text-xl lg:text-2xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-500 px-8 font-sans text-base text-white shadow-lg hover:bg-primary-600 active:scale-[0.98]"
            >
              <a
                href={reservationHref}
                {...(isExternal
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {t("heroCta")}
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 px-8 font-sans text-base text-white shadow-lg backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
            >
              <Link href="/le-gite">{t("heroCta2")}</Link>
            </Button>
          </div>
        </div>

        {/* Chevron bas — desktop uniquement */}
        <div
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 animate-bounce motion-reduce:animate-none lg:block"
          aria-hidden="true"
        >
          <ChevronDown className="h-7 w-7 text-white/50" />
        </div>
      </section>
    );
  }

  // ── Fallback : image unique (comportement historique) ─────────────────────
  return (
    <section
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-primary-900"
      aria-label={t("heroEyebrow")}
    >
      {hasSoloImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            media={soloMedia as Parameters<typeof PayloadImage>[0]["media"]}
            size="hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/75 via-primary-900/40 to-primary-900/20" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/75 via-primary-800/80 to-primary-900/20" />
          <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%2280%22%3E%3Cpath%20d%3D%22M40%204L76%2040L40%2076L4%2040z%22%20fill%3D%22none%22%20stroke%3D%22%23d4c097%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow hero-title mb-5 text-sm tracking-widest text-sand-300/90 drop-shadow-sm sm:text-base">
          {t("heroEyebrow")}
        </p>
        <h1 className="hero-title font-display text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>
        <p className="subtitle-editorial hero-subtitle mt-5 text-xl leading-relaxed text-sand-200 drop-shadow-md sm:text-2xl">
          {subtitle}
        </p>
        <div className="hero-buttons mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-500 px-8 font-sans text-lg text-white shadow-lg hover:bg-primary-600 active:scale-[0.98]"
          >
            <a
              href={reservationHref}
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {t("heroCta")}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/40 bg-white/10 px-8 font-sans text-lg text-white shadow-lg backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
          >
            <Link href="/le-gite">{t("heroCta2")}</Link>
          </Button>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce motion-reduce:animate-none"
        aria-hidden="true"
      >
        <ChevronDown className="h-8 w-8 text-white/60" />
      </div>
    </section>
  );
}
