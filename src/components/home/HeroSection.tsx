import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface HeroSectionProps {
  heroImage?: Record<string, unknown> | string | number | null;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    abritel?: string | null;
    email?: string | null;
  } | null;
  overlayDirection?: "t" | "b" | "br" | "tr";
}

export function HeroSection({
  heroImage,
  heroTitle,
  heroSubtitle,
  bookingLinks,
  overlayDirection = "b",
}: HeroSectionProps) {
  const t = useTranslations("home");

  const title = heroTitle || t("heroTitle");
  const subtitle = heroSubtitle || t("heroSubtitle");

  const hasImage =
    heroImage &&
    typeof heroImage === "object" &&
    (heroImage as Record<string, unknown>).url;

  const reservationHref =
    bookingLinks?.airbnb ||
    bookingLinks?.booking ||
    bookingLinks?.abritel ||
    (bookingLinks?.email ? `mailto:${bookingLinks.email}` : null) ||
    "/tarifs-reservation";

  const isExternal =
    reservationHref.startsWith("http") || reservationHref.startsWith("mailto");

  const directionClass =
    overlayDirection === "t"
      ? "bg-gradient-to-t"
      : overlayDirection === "br"
        ? "bg-gradient-to-br"
        : overlayDirection === "tr"
          ? "bg-gradient-to-tr"
          : "bg-gradient-to-b";

  const startClass = "from-primary-900/75";
  const endClass = "to-primary-900/20";

  return (
    <section
      className="relative flex h-dvh items-center justify-center overflow-hidden bg-primary-900"
      aria-label={t("heroEyebrow")}
    >
      {hasImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            media={heroImage as Parameters<typeof PayloadImage>[0]["media"]}
            size="hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div
            className={`absolute inset-0 ${directionClass} ${startClass} via-primary-900/40 ${endClass}`}
          />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 ${directionClass} ${startClass} via-primary-800/80 ${endClass}`}
          />
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
