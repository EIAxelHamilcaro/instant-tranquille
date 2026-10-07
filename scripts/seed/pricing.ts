import type { Payload } from "payload";
import { type Block, richText } from "./rich-text";

const QUOTED_ON = "2026-10-06T12:00:00.000Z";

const QUOTES = [
  { guests: "2", nights: "2", airbnb: 234, booking: 227 },
  { guests: "4", nights: "2", airbnb: 260, booking: 262 },
  { guests: "6", nights: "2", airbnb: 285, booking: 273 },
  { guests: "2", nights: "7", airbnb: 724, booking: 793 },
  { guests: "4", nights: "7", airbnb: 812, booking: 916 },
  { guests: "6", nights: "7", airbnb: 899, booking: 956 },
] as const;

const TEXTS = {
  fr: {
    note: "Le prix dépend du nombre de voyageurs et de la durée du séjour. Le 6 octobre 2026, jour du relevé, il était identique pour des séjours en novembre, janvier, mars, mai, juillet et août.",
    cancellation: [
      "Sur Booking.com, le tarif flexible s'annule gratuitement jusqu'à la veille de l'arrivée. Un tarif non remboursable, un peu moins cher, y est aussi proposé. Sur Airbnb, les conditions d'annulation s'affichent avant le paiement.",
    ] as Block[],
    checkIn: "À partir de 17h00",
    checkOut: "Avant 10h00",
  },
  en: {
    note: "The price depends on the number of guests and the length of stay. On 6 October 2026, the day the prices were recorded, it was the same for stays in November, January, March, May, July and August.",
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
        quotes: QUOTES.map((quote) => ({ ...quote })),
        minimumStay: 2,
        quotedOn: QUOTED_ON,
        note: text.note,
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
