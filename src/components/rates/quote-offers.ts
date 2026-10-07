import type { Locale } from "@/i18n/config";
import { cottageReference } from "@/lib/jsonld";
import { pricedStays } from "@/lib/platforms";
import { absoluteUrl } from "@/lib/seo";
import type { PricingConfig } from "@/payload-types";

export function quoteOffersJsonLd(pricing: PricingConfig, locale: Locale) {
  const priceCurrency = pricing.currency || "EUR";
  const url = absoluteUrl("/tarifs-reservation", locale);
  const offers = pricedStays(pricing).map((stay) => ({
    "@type": "Offer",
    url,
    price: stay.lowest,
    priceCurrency,
    itemOffered: cottageReference,
    eligibleQuantity: {
      "@type": "QuantitativeValue",
      maxValue: stay.guests,
      unitText: "guests",
    },
    eligibleDuration: {
      "@type": "QuantitativeValue",
      value: stay.nights,
      unitCode: "DAY",
    },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: stay.nightly,
      priceCurrency,
      unitCode: "DAY",
      valueAddedTaxIncluded: true,
    },
  }));

  if (offers.length === 0) return null;

  return { "@context": "https://schema.org", "@graph": offers };
}
