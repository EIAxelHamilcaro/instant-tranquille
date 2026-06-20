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
      <path d="M12.003 0C5.376 0 0 5.372 0 12c0 6.627 5.376 12 12.003 12C18.63 24 24 18.627 24 12c0-6.628-5.37-12-11.997-12zm-.124 4.5c1.02 0 1.846.826 1.846 1.845 0 1.02-.826 1.847-1.846 1.847S10.033 7.365 10.033 6.345c0-1.019.826-1.845 1.846-1.845zM7.382 15.27c-.16-.427-.247-.888-.247-1.363 0-1.985 1.46-3.672 3.368-4.02a4.27 4.27 0 011.495 0c1.907.348 3.368 2.035 3.368 4.02 0 .475-.087.936-.247 1.363l-1.41 3.765c-.217.578-.77.955-1.384.955h-1.75c-.613 0-1.166-.377-1.383-.955L7.382 15.27zm3.25 3.565h.74l1.28-3.415c.103-.277.16-.573.16-.878 0-1.116-.793-2.055-1.862-2.268a2.47 2.47 0 00-.498-.05 2.47 2.47 0 00-.498.05c-1.069.213-1.863 1.152-1.863 2.268 0 .305.057.6.16.878l1.28 3.415z" />
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

export function CTASection({
  bookingLinks,
  ctaTitle: cmsTitle,
  ctaSubtitle: cmsSubtitle,
}: CTASectionProps) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const ref = useReveal();

  const hasAnyPlatformLink = bookingLinks?.airbnb || bookingLinks?.booking;

  return (
    <section className="relative overflow-hidden py-28 sm:py-36" ref={ref}>
      <div className="absolute inset-0">
        <Image
          src="/images/terrasse-salon-jardin.webp"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/55 to-stone-950/70" />
      </div>

      <Container className="relative z-10 text-center">
        <p
          className="reveal font-serif text-base italic tracking-wide text-sand-200/80"
          style={{ "--stagger": 0 } as React.CSSProperties}
        >
          {t("ctaEyebrow")}
        </p>

        <h2
          className="reveal mt-3 text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {cmsTitle ?? t("ctaTitle")}
        </h2>

        <p
          className="reveal mt-4 text-lg text-sand-200 drop-shadow-md sm:text-xl"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          {cmsSubtitle ?? t("ctaSubtitle")}
        </p>

        {hasAnyPlatformLink && (
          <p
            className="reveal mt-8 text-xs font-medium uppercase tracking-widest text-sand-200/60"
            style={{ "--stagger": 3 } as React.CSSProperties}
          >
            {t("ctaChoosePlatform")}
          </p>
        )}

        <div
          className="reveal mt-4 flex flex-wrap items-center justify-center gap-3"
          style={{ "--stagger": 4 } as React.CSSProperties}
        >
          {bookingLinks?.airbnb && (
            <a
              href={bookingLinks.airbnb}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("ctaAirbnb")}, ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#FF385C] px-5 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#E31C5F] active:scale-[0.98]"
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
              aria-label={`${t("ctaBooking")}, ${tCommon("opensNewTab")}`}
              className="inline-flex items-center gap-2.5 rounded-lg bg-[#003580] px-5 py-3 font-sans text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#00224f] active:scale-[0.98]"
            >
              <BookingLogo className="h-5 w-5 shrink-0" />
              {t("ctaBooking")}
            </a>
          )}

          {bookingLinks?.email ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 font-sans text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
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
              className="border-white/30 bg-white/10 font-sans text-white backdrop-blur-sm hover:bg-white/20 active:scale-[0.98]"
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
