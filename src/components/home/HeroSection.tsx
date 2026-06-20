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
  overlayFrom?: string;
  overlayTo?: string;
}

export function HeroSection({
  heroImage,
  heroTitle,
  heroSubtitle,
  bookingLinks,
  overlayFrom = "from-primary-900/70",
  overlayTo = "to-primary-900/20",
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

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-primary-900">
      {hasImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            media={heroImage as Parameters<typeof PayloadImage>[0]["media"]}
            size="hero"
            fill
            priority
            className="object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t ${overlayFrom} via-primary-900/30 ${overlayTo}`}
          />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${overlayFrom} via-primary-800 ${overlayTo}`}
          />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M30%200L60%2030L30%2060L0%2030z%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <p className="subtitle-editorial mb-4 text-lg text-sand-300 drop-shadow-sm sm:text-xl">
          {t("heroEyebrow")}
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl xl:text-8xl">
          {title}
        </h1>
        <p className="subtitle-editorial mt-5 text-xl leading-relaxed text-sand-200 drop-shadow-md sm:text-2xl">
          {subtitle}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-500 px-8 font-sans text-lg text-white shadow-lg hover:bg-primary-600 active:scale-[0.98]"
          >
            <a
              href={reservationHref}
              {...(reservationHref.startsWith("http") ||
              reservationHref.startsWith("mailto")
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/60" aria-hidden="true" />
      </div>
    </section>
  );
}
