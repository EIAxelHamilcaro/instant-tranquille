"use client";

import { useTranslations } from "next-intl";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Container } from "@/components/shared/Container";
import { useReveal } from "@/lib/useReveal";

interface BookingCTAProps {
  bookingLinks?: {
    airbnb?: string | null;
    booking?: string | null;
    email?: string | null;
  } | null;
}

export function BookingCTA({ bookingLinks }: BookingCTAProps) {
  const t = useTranslations("home");
  const ref = useReveal();

  return (
    <section className="bg-primary-900 py-20 md:py-28" ref={ref}>
      <Container className="text-center">
        <p
          className="reveal eyebrow text-xs text-sand-200/80"
          style={{ "--stagger": 0 } as React.CSSProperties}
        >
          {t("ctaEyebrow")}
        </p>
        <h2
          className="reveal display-section mt-4 font-display font-semibold text-white"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          {t("ctaTitle")}
        </h2>
        <p
          className="reveal subtitle-editorial mx-auto mt-4 max-w-xl text-lg text-sand-100"
          style={{ "--stagger": 2 } as React.CSSProperties}
        >
          {t("ctaSubtitle")}
        </p>
        <div
          className="reveal mt-9 flex justify-center"
          style={{ "--stagger": 3 } as React.CSSProperties}
        >
          <BookingButtons bookingLinks={bookingLinks} size="lg" showContact />
        </div>
      </Container>
    </section>
  );
}
