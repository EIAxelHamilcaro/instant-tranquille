import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import type { RatesPageData } from "@/components/live-preview/RatesPageClient";
import { RatesPageClient } from "@/components/live-preview/RatesPageClient";
import { BookingLinks } from "@/components/rates/BookingLinks";
import { PoliciesSection } from "@/components/rates/PoliciesSection";
import { PricingTable } from "@/components/rates/PricingTable";
import { SeasonCalendar } from "@/components/rates/SeasonCalendar";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import type { Locale } from "@/i18n/config";
import { generateBreadcrumbJsonLd, generatePricingJsonLd } from "@/lib/jsonld";
import { getPricingConfig } from "@/lib/queries";
import { generateCmsPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;

  return generateCmsPageMetadata(
    "tarifs-reservation",
    locale as Locale,
    "/tarifs-reservation",
    messages.rates.title,
    messages.rates.description,
  );
}

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const pricingConfig = (await getPricingConfig(
    locale,
    isDraft,
  )) as RatesPageData;

  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: messages.nav.home, url: "/" },
    { name: messages.rates.title, url: "/tarifs-reservation" },
  ]);

  const seasons = pricingConfig.seasons ?? [];
  const additionalFees = pricingConfig.additionalFees ?? [];
  const currency = pricingConfig.currency || "EUR";

  const pricingJsonLd = generatePricingJsonLd(seasons, { currency });

  if (isDraft) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        {pricingJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
          />
        )}
        <h1 className="sr-only">{messages.rates.h1}</h1>
        <RatesPageClient
          initialData={{
            seasons,
            additionalFees,
            currency,
            bookingLinks: pricingConfig.bookingLinks,
            policies: pricingConfig.policies,
          }}
        />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {pricingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: messages.nav.home, href: "/" },
          { label: messages.rates.title },
        ]}
      />
      <h1 className="sr-only">{messages.rates.h1}</h1>
      <PricingTable
        seasons={seasons}
        additionalFees={additionalFees}
        currency={currency}
      />
      <SeasonCalendar seasons={seasons} currency={currency} />
      <BookingLinks bookingLinks={pricingConfig.bookingLinks} />
      <PoliciesSection policies={pricingConfig.policies} />
    </>
  );
}
