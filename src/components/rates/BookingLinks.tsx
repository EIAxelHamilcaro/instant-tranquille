"use client";

import { useTranslations } from "next-intl";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
  const ref = useReveal();

  return (
    <section className="bg-sand-100 py-16" ref={ref}>
      <Container className="text-center">
        <SectionHeading title={t("bookTitle")} subtitle={t("bookSubtitle")} />
        <div
          className="reveal flex justify-center"
          style={{ "--stagger": 1 } as React.CSSProperties}
        >
          <BookingButtons bookingLinks={bookingLinks} size="lg" showContact />
        </div>
      </Container>
    </section>
  );
}
