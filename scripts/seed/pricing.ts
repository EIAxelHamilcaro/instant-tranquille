import type { Payload } from "payload";
import { type Block, richText } from "./rich-text";

export const NIGHTLY_RATES = [
  { guests: "2", price: 100 },
  { guests: "4", price: 110 },
  { guests: "6", price: 120 },
] as const;

const TEXTS = {
  fr: {
    cancellation: [
      "Sur Booking.com, le tarif flexible s'annule gratuitement jusqu'à la veille de l'arrivée. Un tarif non remboursable, un peu moins cher, y est aussi proposé. Sur Airbnb, les conditions d'annulation s'affichent avant le paiement.",
    ] as Block[],
    checkIn: "À partir de 17h00",
    checkOut: "Avant 10h00",
  },
  en: {
    cancellation: [
      "On Booking.com, the flexible rate can be cancelled free of charge until the day before arrival. A slightly cheaper non-refundable rate is also offered. On Airbnb, the cancellation terms are shown before you pay.",
    ] as Block[],
    checkIn: "From 17:00",
    checkOut: "Before 10:00",
  },
};

export async function seedPricing(payload: Payload) {
  for (const locale of ["fr", "en"] as const) {
    const text = TEXTS[locale];

    await payload.updateGlobal({
      slug: "pricing-config",
      locale,
      data: {
        currency: "EUR",
        nightlyRates: NIGHTLY_RATES.map((rate) => ({ ...rate })),
        minimumStay: 2,
        note: null,
        additionalFees: [],
        policies: {
          cancellation: richText(text.cancellation),
          deposit: null,
          checkIn: text.checkIn,
          checkOut: text.checkOut,
          additional: null,
        },
        _status: "published",
      },
    });
  }

  console.log("Pricing seeded");
}
