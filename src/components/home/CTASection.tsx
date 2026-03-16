"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

type BookingLinks = {
  airbnb?: string | null;
  booking?: string | null;
  abritel?: string | null;
  email?: string | null;
};

export function CTASection({
  bookingLinks,
  ctaTitle: cmsTitle,
  ctaSubtitle: cmsSubtitle,
}: {
  bookingLinks?: BookingLinks | null;
  ctaTitle?: string | null;
  ctaSubtitle?: string | null;
}) {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const ref = useReveal();

  return (
    <section className="bg-primary-500 py-16" ref={ref}>
      <Container className="text-center">
        <h2 className="reveal text-3xl font-bold text-white sm:text-4xl">
          {cmsTitle || t("ctaTitle")}
        </h2>
        <p className="reveal mt-3 text-lg text-white" style={{ "--stagger": 1 } as React.CSSProperties}>
          {cmsSubtitle || t("ctaSubtitle")}
        </p>
        <div className="reveal mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ "--stagger": 2 } as React.CSSProperties}>
          {bookingLinks?.airbnb && (
            <ExternalLinkButton
              href={bookingLinks.airbnb}
              variant="earth"
              className="min-w-[200px] justify-center"
              aria-label={`${t("ctaAirbnb")} — ${tCommon("opensNewTab")}`}
            >
              {t("ctaAirbnb")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.booking && (
            <ExternalLinkButton
              href={bookingLinks.booking}
              className="min-w-[200px] justify-center bg-white text-primary-700 hover:bg-sand-100"
              aria-label={`${t("ctaBooking")} — ${tCommon("opensNewTab")}`}
            >
              {t("ctaBooking")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.abritel && (
            <ExternalLinkButton
              href={bookingLinks.abritel}
              variant="earth"
              className="min-w-[200px] justify-center"
              aria-label={`${t("ctaAbritel")} — ${tCommon("opensNewTab")}`}
            >
              {t("ctaAbritel")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.email ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[200px] border-white/30 font-sans text-white hover:bg-white/10 active:scale-[0.98]"
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
              className="min-w-[200px] border-white/30 font-sans text-white hover:bg-white/10 active:scale-[0.98]"
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
