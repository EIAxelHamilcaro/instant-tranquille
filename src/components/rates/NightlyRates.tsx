import { getLocale, getTranslations } from "next-intl/server";
import { formatPrice, type NightlyRate } from "@/lib/platforms";

interface NightlyRatesProps {
  rates: NightlyRate[];
  currency: string;
}

const SUM_TERMS = ["base", "service", "tax", "total"] as const;

export async function NightlyRates({ rates, currency }: NightlyRatesProps) {
  const locale = await getLocale();
  const t = await getTranslations("rates");
  const common = await getTranslations("common.rates");

  return (
    <>
      <ul className="devis">
        {rates.map((rate) => (
          <li key={rate.guests}>
            <h3>{common("guests", { count: rate.guests })}</h3>
            <p className="montant-sejour">
              <strong>{formatPrice(rate.price, currency, locale)}</strong>
              {t("nightly")}
            </p>
          </li>
        ))}
      </ul>

      <ol className="addition" aria-label={t("sum.title")}>
        {SUM_TERMS.map((term) => (
          <li key={term}>
            <strong>{t(`sum.${term}`)}</strong>
            <span>{t(`sum.${term}Detail`)}</span>
          </li>
        ))}
      </ol>
    </>
  );
}
