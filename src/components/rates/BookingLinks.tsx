"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

type BookingLinksData = {
  airbnb?: string | null;
  booking?: string | null;
  abritel?: string | null;
  email?: string | null;
};

export function BookingLinks({
  bookingLinks,
}: {
  bookingLinks?: BookingLinksData | null;
}) {
  const t = useTranslations("rates");
  const tHome = useTranslations("home");
  const tCommon = useTranslations("common");
  const ref = useReveal();

  return (
    <section className="bg-sand-100 py-16" ref={ref}>
      <Container className="text-center">
        <SectionHeading title={t("bookTitle")} subtitle={t("bookSubtitle")} />
        <div className="reveal flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ "--stagger": 1 } as React.CSSProperties}>
          {bookingLinks?.airbnb && (
            <ExternalLinkButton
              href={bookingLinks.airbnb}
              variant="earth"
              className="min-w-[220px] justify-center"
              aria-label={`${tHome("ctaAirbnb")} — ${tCommon("opensNewTab")}`}
            >
              {tHome("ctaAirbnb")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.booking && (
            <ExternalLinkButton
              href={bookingLinks.booking}
              variant="primary"
              className="min-w-[220px] justify-center"
              aria-label={`${tHome("ctaBooking")} — ${tCommon("opensNewTab")}`}
            >
              {tHome("ctaBooking")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.abritel && (
            <ExternalLinkButton
              href={bookingLinks.abritel}
              variant="earth"
              className="min-w-[220px] justify-center"
              aria-label={`${tHome("ctaAbritel")} — ${tCommon("opensNewTab")}`}
            >
              {tHome("ctaAbritel")}
            </ExternalLinkButton>
          )}
          {bookingLinks?.email ? (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[220px] border-primary-500 font-sans text-primary-600 hover:bg-primary-50 active:scale-[0.98]"
            >
              <a href={`mailto:${bookingLinks.email}`}>
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                {tHome("ctaEmailDirect")}
              </a>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[220px] border-primary-500 font-sans text-primary-600 hover:bg-primary-50 active:scale-[0.98]"
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                {tHome("ctaContact")}
              </Link>
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}
