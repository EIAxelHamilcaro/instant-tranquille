import type { Locale } from "@/i18n/config";
import { cottageReference } from "@/lib/jsonld";
import { nightlyRates } from "@/lib/platforms";
import { absoluteUrl } from "@/lib/seo";
import type { PricingConfig } from "@/payload-types";

interface RateOffersInput {
  pricing: PricingConfig;
  locale: Locale;
  description: string;
  nameFor: (guests: number) => string;
}

export function rateOffersJsonLd({
  pricing,
  locale,
  description,
  nameFor,
}: RateOffersInput) {
  const priceCurrency = pricing.currency || "EUR";
  const url = absoluteUrl("/tarifs-reservation", locale);
  const offers = nightlyRates(pricing).map((rate) => ({
    "@type": "Offer",
    url,
    name: nameFor(rate.guests),
    description,
    itemOffered: cottageReference,
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      maxValue: rate.guests,
      unitText: "guests",
    },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: rate.price,
      priceCurrency,
      unitCode: "DAY",
    },
  }));

  if (offers.length === 0) return null;

  return { "@context": "https://schema.org", "@graph": offers };
}
