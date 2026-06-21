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
    thumbnail?: { url?: string | null } | null;
    card?: { url?: string | null } | null;
    hero?: { url?: string | null } | null;
  } | null;
};

type HeroImageItem = { image?: MediaObject | string | number | null };

interface HeroSectionProps {
  heroImage?: Record<string, unknown> | string | number | null;
  heroImages?: HeroImageItem[] | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  coordinates?: { lat?: number | null; lng?: number | null } | null;
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    abritel?: string | null;
    email?: string | null;
  } | null;
}

type HeroMedia = Parameters<typeof PayloadImage>[0]["media"];

function formatCoordinates(
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  } | null,
): string | null {
  const lat = coordinates?.lat;
  const lng = coordinates?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "O";
  return `${Math.abs(lat).toFixed(4)}° ${ns} · ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

export function HeroSection({
  heroImage,
  heroImages,
  heroTitle,
  heroSubtitle,
  coordinates,
  bookingLinks,
}: HeroSectionProps) {
  const t = useTranslations("home");

  const title = heroTitle || t("heroTitle");
  const subtitle = heroSubtitle || t("heroSubtitle");
  const coords = formatCoordinates(coordinates);

  const reservationHref =
    bookingLinks?.airbnb ||
    bookingLinks?.booking ||
    (bookingLinks?.email ? `mailto:${bookingLinks.email}` : null) ||
    "/tarifs-reservation";
  const isExternal =
    reservationHref.startsWith("http") || reservationHref.startsWith("mailto");

  const mosaicMedias: Array<MediaObject | string | number> = [];
  if (heroImages && heroImages.length > 0) {
    for (const item of heroImages.slice(0, 3)) {
      if (item.image != null) {
        mosaicMedias.push(item.image as MediaObject | string | number);
      }
    }
  }

  const legacyMedia = mosaicMedias.length === 0 && heroImage ? heroImage : null;
  const useMosaic = mosaicMedias.length >= 3;
  const soloMedia = useMosaic ? null : (mosaicMedias[0] ?? legacyMedia ?? null);
  const hasSoloImage =
    soloMedia &&
    (typeof soloMedia === "object" ? (soloMedia as MediaObject).url : false);

  const panel = (
    <div className="flex max-w-xl flex-col items-start">
      <p
        className="data hero-stagger text-xs text-sand-300/90 sm:text-sm"
        style={{ "--reveal-delay": 100 } as React.CSSProperties}
      >
        {t("heroEyebrow")}
      </p>
      <h1
        className="hero-stagger display-hero mt-5 font-display font-semibold text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]"
        style={{ "--reveal-delay": 200 } as React.CSSProperties}
      >
        {title}
      </h1>
      <p
        className="subtitle-editorial hero-stagger mt-5 text-lg leading-relaxed text-sand-100/95 drop-shadow-md sm:text-xl lg:text-2xl"
        style={{ "--reveal-delay": 320 } as React.CSSProperties}
      >
        {subtitle}
      </p>
      <div
        className="hero-stagger mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        style={{ "--reveal-delay": 440 } as React.CSSProperties}
      >
        <Button
          asChild
          size="lg"
          className="bg-primary-500 px-8 font-sans text-base text-white shadow-lg transition-transform hover:bg-primary-600 active:scale-[0.98]"
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
          className="border-white/40 bg-white/10 px-8 font-sans text-base text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98]"
        >
          <Link href="/le-gite">{t("heroCta2")}</Link>
        </Button>
      </div>
      {coords && (
        <p
          className="data hero-stagger mt-9 text-[0.7rem] tracking-tight text-sand-300/70 sm:text-xs"
          style={{ "--reveal-delay": 560 } as React.CSSProperties}
        >
          {coords}
        </p>
      )}
    </div>
  );

  const scrollCue = (
    <div
      className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-bounce motion-reduce:animate-none"
      aria-hidden="true"
    >
      <ChevronDown className="h-7 w-7 text-white/60" />
    </div>
  );

  if (useMosaic) {
    const CLIP_MAIN = "polygon(0 0, 100% 0, 66.67% 100%, 0 100%)";
    const CLIP_TOP = "polygon(20% 0, 100% 0, 100% 70%, 0 100%)";
    const CLIP_BOTTOM = "polygon(16.67% 23.08%, 100% 0, 100% 100%, 0 100%)";

    return (
      <section
        className="relative min-h-dvh overflow-hidden bg-[#161d14]"
        aria-label={t("heroEyebrow")}
      >
        <div className="grid h-dvh grid-rows-[1.25fr_1fr_1fr] gap-[3px] lg:hidden">
          <div className="img-graded relative overflow-hidden">
            <PayloadImage
              media={mosaicMedias[0] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="img-graded relative overflow-hidden">
            <PayloadImage
              media={mosaicMedias[1] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="img-graded relative overflow-hidden">
            <PayloadImage
              media={mosaicMedias[2] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        </div>

        <div className="absolute inset-0 hidden lg:block">
          <div
            className="img-graded hero-reveal absolute left-0 top-0 h-full w-[60%]"
            style={
              {
                clipPath: CLIP_MAIN,
                "--reveal-delay": 0,
              } as React.CSSProperties
            }
          >
            <PayloadImage
              media={mosaicMedias[0] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="60vw"
            />
          </div>
          <div
            className="img-graded hero-reveal absolute left-[50%] top-0 h-[50%] w-[50%]"
            style={
              {
                clipPath: CLIP_TOP,
                "--reveal-delay": 140,
              } as React.CSSProperties
            }
          >
            <PayloadImage
              media={mosaicMedias[1] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="50vw"
            />
          </div>
          <div
            className="img-graded hero-reveal absolute left-[40%] top-[35%] h-[65%] w-[60%]"
            style={
              {
                clipPath: CLIP_BOTTOM,
                "--reveal-delay": 280,
              } as React.CSSProperties
            }
          >
            <PayloadImage
              media={mosaicMedias[2] as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
              sizes="60vw"
            />
          </div>
        </div>

        <svg
          className="absolute inset-0 hidden h-full w-full lg:block"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <title>Séparations de la mosaïque</title>
          <line
            x1="60"
            y1="0"
            x2="40"
            y2="100"
            stroke="#f4efe2"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="50"
            y1="50"
            x2="100"
            y2="35"
            stroke="#f4efe2"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-[#161d14]/90 via-[#161d14]/20 to-transparent lg:bg-gradient-to-r lg:from-[#161d14]/80 lg:via-[#161d14]/30 lg:to-transparent" />

        <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-12 lg:inset-y-0 lg:right-auto lg:flex lg:w-auto lg:max-w-xl lg:flex-col lg:justify-center lg:px-12 lg:pb-0 xl:px-20">
          {panel}
        </div>

        <div className="hidden lg:block">{scrollCue}</div>
      </section>
    );
  }

  return (
    <section
      className="relative flex min-h-dvh items-center overflow-hidden bg-[#161d14]"
      aria-label={t("heroEyebrow")}
    >
      {hasSoloImage ? (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="hero-reveal absolute inset-0"
            style={{ "--reveal-delay": 0 } as React.CSSProperties}
          >
            <PayloadImage
              media={soloMedia as HeroMedia}
              size="hero"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#161d14]/85 via-[#161d14]/55 to-[#161d14]/25" />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#161d14] via-primary-800 to-[#161d14]" />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-20">
        {panel}
      </div>

      {scrollCue}
    </section>
  );
}
