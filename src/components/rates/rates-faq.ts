import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import type { FaqItem } from "@/lib/jsonld";
import { formatPrice, nightlyRange, nightlyRates } from "@/lib/platforms";
import type { PricingConfig, SiteSetting } from "@/payload-types";

export async function ratesFaq(
  pricing: PricingConfig,
  settings: SiteSetting,
  locale: Locale,
): Promise<FaqItem[]> {
  const t = await getTranslations({ locale, namespace: "rates.faq" });
  const common = await getTranslations({ locale, namespace: "common.rates" });
  const feeLabel = await getTranslations({ locale, namespace: "rates.fees" });
  const currency = pricing.currency || "EUR";
  const fees = pricing.additionalFees ?? [];
  const rates = nightlyRates(pricing);
  const entryPrice = nightlyRange(rates)?.min;
  const { checkIn, checkOut } = pricing.policies ?? {};
  const petsAllowed = settings.propertyDetails?.petsAllowed;
  const items: FaqItem[] = [];

  const list = (parts: string[]) =>
    new Intl.ListFormat(locale, { type: "conjunction" }).format(parts);

  if (rates.length > 0) {
    items.push({
      question: t("priceQuestion"),
      answer: t("priceAnswer", {
        prices: list(
          rates.map((rate) =>
            common("rateFor", {
              price: formatPrice(rate.price, currency, locale),
              guests: rate.guests,
            }),
          ),
        ),
      }),
    });
  }

  if (pricing.note) {
    items.push({ question: t("seasonQuestion"), answer: pricing.note });
  }

  if (typeof entryPrice === "number") {
    items.push({
      question: t("weekQuestion"),
      answer: t("weekAnswer", {
        price: formatPrice(entryPrice, currency, locale),
      }),
    });
  }

  if (pricing.minimumStay) {
    items.push({
      question: t("minStayQuestion"),
      answer: t("minStayAnswer", { count: pricing.minimumStay }),
    });
  }

  items.push({
    question: t("feesQuestion"),
    answer:
      fees.length > 0
        ? t("feesAnswer", {
            fees: list(
              fees.map((fee) =>
                t("feeItem", {
                  name: fee.name,
                  amount: feeLabel(fee.type ?? "flat", {
                    amount: formatPrice(fee.amount, currency, locale),
                  }),
                }),
              ),
            ),
          })
        : t("feesAnswerNone"),
  });

  if (checkIn && checkOut) {
    items.push({
      question: t("timesQuestion"),
      answer: t("timesAnswer", { checkIn, checkOut }),
    });
  }

  if (typeof petsAllowed === "boolean") {
    items.push({
      question: t("petsQuestion"),
      answer: t(petsAllowed ? "petsAnswerYes" : "petsAnswerNo"),
    });
  }

  return items;
}
