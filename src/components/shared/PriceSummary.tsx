import { getLocale, getTranslations } from "next-intl/server";
import { formatPrice, nightlyRates } from "@/lib/platforms";
import type { PricingConfig } from "@/payload-types";

interface PriceSummaryProps {
  pricing: PricingConfig;
}

export async function PriceSummary({ pricing }: PriceSummaryProps) {
  const locale = await getLocale();
  const t = await getTranslations("common.rates");
  const currency = pricing.currency || "EUR";
  const rates = nightlyRates(pricing);
  if (rates.length === 0) return null;

  return (
    <>
      <ul className="liste-lieux">
        {rates.map((rate) => (
          <li key={rate.guests}>
            <h3>{t("guests", { count: rate.guests })}</h3>
            <span className="trajet">
              {t("perNight", {
                price: formatPrice(rate.price, currency, locale),
              })}
            </span>
          </li>
        ))}
      </ul>
      <p className="legende">
        {t("base")} {t("exact")}
      </p>
    </>
  );
}
