"use client";

import { Mail } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useReveal } from "@/lib/useReveal";

interface BookingLinks {
  airbnb?: string | null;
  booking?: string | null;
  abritel?: string | null;
  email?: string | null;
}

interface CTASectionProps {
  bookingLinks?: BookingLinks | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
}

function AirbnbLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12c0-6.627-5.373-12-12-12zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 3.5c-1.24 0-2.25 1.01-2.25 2.25S10.76 10 12 10s2.25-1.01 2.25-2.25S13.24 5.5 12 5.5zm0 1.5c.414 0 .75.336.75.75S12.414 8.5 12 8.5s-.75-.336-.75-.75S11.586 7 12 7zm-4.5 5c0-1.24.477-2.25 1.5-3.25.355-.34.74-.63 1.155-.866C9.647 8.16 9.5 8.583 9.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5c0-.417-.147-.84-.655-1.116.415.236.8.526 1.155.866 1.023 1 1.5 2.01 1.5 3.25 0 1.657-.895 2.75-2.25 3.5h-.25v2c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-2H11C9.645 14.75 7.5 13.657 7.5 12zm2.25 1.5h.75v2c0 .276.224.5.5.5s.5-.224.5-.5v-2h.75c.97-.46 1.75-1.18 1.75-1.5 0-.77-.297-1.5-.96-2.19A3.99 3.99 0 0012 9.5a3.99 3.99 0 00-1.04.31C10.297 10.5 10 11.23 10 12c0 .32.78 1.04 1.75 1.5z" />
    </svg>
  );
}

function BookingLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.246 0A2.246 2.246 0 000 2.246v19.512A2.246 2.246 0 002.246 24h19.512A2.246 2.246 0 0024 21.754V2.246A2.246 2.246 0 0021.758 0zm6.377 4.808h2.03c1.46 0 2.444.265 2.953.794.51.529.765 1.291.765 2.284 0 .74-.176 1.373-.529 1.896-.353.523-.877.854-1.571.996.46.12.812.385 1.053.796.244.41.557 1.14.942 2.19l1.088 2.955H13.03l-.877-2.547c-.37-1.058-.676-1.718-.916-1.98-.24-.264-.606-.396-1.097-.396H9.96v4.923H8.623zm1.337 1.186v3.548h.968c.838 0 1.412-.16 1.723-.48.311-.32.466-.793.466-1.42 0-.6-.163-1.056-.49-1.366-.327-.31-.876-.466-1.645-.466h-1.022zm5.79-.006h1.338v9.44h-1.338z" />
    </svg>
  );
}

function AbritelLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L2 7l1.5 1L12 4l8.5 4L22 7zm-9 6.5V20h6v-6h6v6h6V8.5L12 4z" />
    </svg>
  );
}

export function CTASection({
  bookingLinks,
  ctaTitle: cmsTitle,
  ctaSubtitle: cmsSubtitle,
}: CTASectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const ref = useReveal();

  return (
    <section className="relative overflow-hidden py-24" ref={ref}>
      <div className="absolute inset-0">
        <Image
          src="/images/terrasse-salon-jardin.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/75 via-primary-900/65 to-primary-900/80" />
      </div>

      <Container className="relative z-10 text-center">
        <h2 className="reveal text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
          {cmsTitle || t("ctaTitle")}
        </h2>
        <p
          className="subtitle-editorial reveal mt-4 text-lg text-sand-200 drop-shadow-md sm:text-xl"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {cmsSubtitle || t("ctaSubtitle")}
        </p>

        <div
          className="reveal mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          {bookingLinks?.airbnb && (
            <a
              href={bookingLinks.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("ctaAirbnb")} — ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#FF385C] px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E31C5F] active:scale-[0.98]"
            >
              <AirbnbLogo className="h-5 w-5 shrink-0" />
              {t("ctaAirbnb")}
            </a>
          )}

          {bookingLinks?.booking && (
            <a
              href={bookingLinks.booking}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("ctaBooking")} — ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#003580] px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#00224f] active:scale-[0.98]"
            >
              <BookingLogo className="h-5 w-5 shrink-0" />
              {t("ctaBooking")}
            </a>
          )}

          {bookingLinks?.abritel && (
            <a
              href={bookingLinks.abritel}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("ctaAbritel")} — ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#1B468A] px-6 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#153970] active:scale-[0.98]"
            >
              <AbritelLogo className="h-5 w-5 shrink-0" />
              {t("ctaAbritel")}
            </a>
          )}

          {bookingLinks?.email ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 font-sans text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
            >
              <a href={`mailto:${bookingLinks.email}`}>
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("ctaEmailDirect")}
              </a>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 font-sans text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                {t("ctaContact")}
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
