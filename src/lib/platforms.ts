import type { PricingConfig, SiteSetting } from "@/payload-types";

export type Platform = NonNullable<SiteSetting["platforms"]>[number];

const PLATFORM_NAMES: Record<Platform["platform"], string> = {
  airbnb: "Airbnb",
  booking: "Booking.com",
  google: "Google",
  "gites-de-france": "Gîtes de France",
  other: "",
};

export function platformName(platform: Platform) {
  return PLATFORM_NAMES[platform.platform] || new URL(platform.url).hostname;
}

const DISTINGUISHED_PLATFORM: Platform["platform"] = "airbnb";

export function isDistinguished(platform: Platform["platform"]) {
  return platform === DISTINGUISHED_PLATFORM;
}

export function ratedPlatforms(settings: SiteSetting) {
  return (settings.platforms ?? []).filter(
    (platform) => platform.rating && platform.reviewCount,
  );
}

export function formatRating(rating: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(rating);
}

export function formatPrice(amount: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export interface NightlyRate {
  guests: number;
  price: number;
}

const REFERENCE_GUESTS = 4;

export function nightlyRates(pricing: PricingConfig): NightlyRate[] {
  return (pricing.nightlyRates ?? [])
    .flatMap(({ guests, price }) =>
      typeof price === "number" ? [{ guests: Number(guests), price }] : [],
    )
    .sort((a, b) => a.guests - b.guests);
}

export function referenceRate(rates: NightlyRate[]) {
  return rates.find((rate) => rate.guests === REFERENCE_GUESTS) ?? rates[0];
}

export function nightlyRange(rates: NightlyRate[]) {
  const prices = rates.map((rate) => rate.price);
  if (prices.length === 0) return null;

  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function formatLongDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}
