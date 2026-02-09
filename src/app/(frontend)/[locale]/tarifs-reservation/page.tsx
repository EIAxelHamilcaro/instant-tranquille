import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import { generateCmsPageMetadata } from "@/lib/seo";
import { generateBreadcrumbJsonLd } from "@/lib/jsonld";
import { getPricingConfig } from "@/lib/queries";
import { PricingTable } from "@/components/rates/PricingTable";
import { BookingLinks } from "@/components/rates/BookingLinks";
import { PoliciesSection } from "@/components/rates/PoliciesSection";
import { RatesPageClient } from "@/components/live-preview/RatesPageClient";

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
    `${messages.rates.title} — L'Instant Tranquille`,
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

  const pricingConfig = await getPricingConfig(locale, isDraft) as Record<string, any>;

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Accueil", url: "/" },
    { name: "Tarifs & Réservation", url: "/tarifs-reservation" },
  ]);

  if (isDraft) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <RatesPageClient
          initialData={{
            seasons: pricingConfig.seasons || [],
            additionalFees: pricingConfig.additionalFees || [],
            currency: (pricingConfig.currency as string) || "EUR",
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
      <PricingTable
        seasons={pricingConfig.seasons || []}
        additionalFees={pricingConfig.additionalFees || []}
        currency={(pricingConfig.currency as string) || "EUR"}
      />
      <BookingLinks bookingLinks={pricingConfig.bookingLinks} />
      <PoliciesSection policies={pricingConfig.policies} />
    </>
  );
}
