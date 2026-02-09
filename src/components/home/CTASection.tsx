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
  email?: string | null;
};

export function CTASection({
  bookingLinks,
}: {
  bookingLinks?: BookingLinks | null;
}) {
  const t = useTranslations("home");
  const ref = useReveal();

  const airbnbUrl = bookingLinks?.airbnb || "#";
  const bookingUrl = bookingLinks?.booking || "#";

  return (
    <section className="bg-primary-500 py-16" ref={ref}>
      <Container className="text-center">
        <h2 className="reveal text-3xl font-bold text-white sm:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="reveal mt-3 text-lg text-white" style={{ "--stagger": 1 } as React.CSSProperties}>
          {t("ctaSubtitle")}
        </p>
        <div className="reveal mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ "--stagger": 2 } as React.CSSProperties}>
          <ExternalLinkButton
            href={airbnbUrl}
            variant="earth"
            className="min-w-[200px] justify-center"
          >
            {t("ctaAirbnb")}
          </ExternalLinkButton>
          <ExternalLinkButton
            href={bookingUrl}
            className="min-w-[200px] justify-center bg-white text-primary-700 hover:bg-sand-100"
          >
            {t("ctaBooking")}
          </ExternalLinkButton>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[200px] border-white/30 font-sans text-white hover:bg-white/10 active:scale-[0.98]"
          >
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              {t("ctaContact")}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
