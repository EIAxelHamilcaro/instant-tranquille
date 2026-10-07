import { getLocale, getTranslations } from "next-intl/server";
import {
  BOOKING_PLATFORM_NAMES,
  BOOKING_PLATFORMS,
  formatPrice,
  formatQuoteDate,
  pricedStays,
  shortestStays,
} from "@/lib/platforms";
import type { PricingConfig } from "@/payload-types";

interface PriceSummaryProps {
  pricing: PricingConfig;
}

export async function PriceSummary({ pricing }: PriceSummaryProps) {
  const locale = await getLocale();
  const t = await getTranslations("common.rates");
  const currency = pricing.currency || "EUR";
  const stays = shortestStays(pricedStays(pricing));
  const price = (amount: number) => formatPrice(amount, currency, locale);
  if (stays.length === 0) return null;

  return (
    <>
      <ul className="liste-lieux">
        {stays.map((stay) => (
          <li key={stay.guests}>
            <h3>{t("guests", { count: stay.guests })}</h3>
            <span className="trajet">
              {t("stayFrom", {
                price: price(stay.lowest),
                nights: stay.nights,
              })}
            </span>
            <p className="description">
              {BOOKING_PLATFORMS.flatMap((platform) => {
                const total = stay.prices[platform];

                return typeof total === "number"
                  ? [
                      t("on", {
                        platform: BOOKING_PLATFORM_NAMES[platform],
                        price: price(total),
                      }),
                    ]
                  : [];
              }).join(", ")}
            </p>
          </li>
        ))}
      </ul>
      {pricing.quotedOn && (
        <p className="legende">
          {t("quoted", { date: formatQuoteDate(pricing.quotedOn, locale) })}{" "}
          {t("exact")}
        </p>
      )}
    </>
  );
}
