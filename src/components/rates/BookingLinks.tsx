import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ExternalLinkButton } from "@/components/shared/ExternalLinkButton";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

type BookingLinksData = {
  airbnb?: string | null;
  booking?: string | null;
  email?: string | null;
};

export function BookingLinks({
  bookingLinks,
}: {
  bookingLinks?: BookingLinksData | null;
}) {
  const t = useTranslations("rates");
  const tHome = useTranslations("home");

  const airbnbUrl = bookingLinks?.airbnb || "#";
  const bookingUrl = bookingLinks?.booking || "#";

  return (
    <section className="bg-sand-100 py-16">
      <Container className="text-center">
        <SectionHeading title={t("bookTitle")} subtitle={t("bookSubtitle")} />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ExternalLinkButton
            href={airbnbUrl}
            variant="earth"
            className="min-w-[220px] justify-center"
          >
            {tHome("ctaAirbnb")}
          </ExternalLinkButton>
          <ExternalLinkButton
            href={bookingUrl}
            variant="primary"
            className="min-w-[220px] justify-center"
          >
            {tHome("ctaBooking")}
          </ExternalLinkButton>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[220px] border-primary-500 font-sans text-primary-600 hover:bg-primary-50"
          >
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              {tHome("ctaContact")}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
