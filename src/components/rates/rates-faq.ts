import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import type { FaqItem } from "@/lib/jsonld";
import {
  BOOKING_PLATFORM_NAMES,
  BOOKING_PLATFORMS,
  formatPrice,
  formatQuoteDate,
  type PricedStay,
  pricedStays,
  referenceStay,
} from "@/lib/platforms";
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
  const stays = pricedStays(pricing);
  const reference = referenceStay(stays);
  const longest = stays.findLast((stay) => stay.guests === reference?.guests);
  const { checkIn, checkOut } = pricing.policies ?? {};
  const petsAllowed = settings.propertyDetails?.petsAllowed;
  const items: FaqItem[] = [];

  const list = (parts: string[]) =>
    new Intl.ListFormat(locale, { type: "conjunction" }).format(parts);
  const platformPrices = (stay: PricedStay) =>
    list(
      BOOKING_PLATFORMS.flatMap((platform) => {
        const total = stay.prices[platform];

        return typeof total === "number"
          ? [
              common("on", {
                platform: BOOKING_PLATFORM_NAMES[platform],
                price: formatPrice(total, currency, locale),
              }),
            ]
          : [];
      }),
    );

  if (reference) {
    items.push({
      question: t("priceQuestion"),
      answer: t("priceAnswer", {
        price: formatPrice(reference.nightly, currency, locale),
        guests: reference.guests,
        nights: reference.nights,
        prices: platformPrices(reference),
      }),
    });
  }

  if (pricing.note) {
    items.push({ question: t("seasonQuestion"), answer: pricing.note });
  }

  if (longest && longest !== reference) {
    items.push({
      question: t("weekQuestion", { nights: longest.nights }),
      answer: t("weekAnswer", {
        nights: longest.nights,
        guests: longest.guests,
        prices: platformPrices(longest),
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
        : pricing.quotedOn
          ? t("feesAnswerNoneDated", {
              date: formatQuoteDate(pricing.quotedOn, locale),
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
