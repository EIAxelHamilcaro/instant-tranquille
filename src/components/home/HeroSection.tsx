import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ChevronDown } from "lucide-react";

export function HeroSection({ heroImage }: { heroImage?: any }) {
  const t = useTranslations("home");

  const hasImage = heroImage && typeof heroImage === "object" && heroImage.url;

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-primary-800">
      {hasImage ? (
        <>
          <div className="absolute inset-0">
            <PayloadImage
              media={heroImage}
              size="hero"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-primary-900/50" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900" />
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M30%200L60%2030L30%2060L0%2030z%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-primary-900/20" />
        </>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
          {t("heroTitle")}
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-sand-200 drop-shadow-md sm:text-2xl">
          {t("heroSubtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-primary-500 px-8 font-sans text-lg text-white shadow-lg hover:bg-primary-600"
          >
            <Link href="/le-gite">{t("heroCta")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/40 bg-white/10 px-8 font-sans text-lg text-white shadow-lg backdrop-blur-sm hover:bg-white/20"
          >
            <Link href="/tarifs-reservation">{t("ctaAirbnb")}</Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/60" />
      </div>
    </section>
  );
}
