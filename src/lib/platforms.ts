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

export type BookingPlatform = "airbnb" | "booking";

export interface PricedStay {
  guests: number;
  nights: number;
  prices: Partial<Record<BookingPlatform, number>>;
  lowest: number;
  nightly: number;
}

export const BOOKING_PLATFORMS: BookingPlatform[] = ["airbnb", "booking"];

export const BOOKING_PLATFORM_NAMES: Record<BookingPlatform, string> = {
  airbnb: PLATFORM_NAMES.airbnb,
  booking: PLATFORM_NAMES.booking,
};

const REFERENCE_GUESTS = 4;

export function nightlyPrice(total: number, nights: number) {
  return Math.round((total / nights) * 100) / 100;
}

export function pricedStays(pricing: PricingConfig): PricedStay[] {
  return (pricing.quotes ?? [])
    .flatMap((quote) => {
      const prices = {
        airbnb: quote.airbnb ?? undefined,
        booking: quote.booking ?? undefined,
      };
      const totals = Object.values(prices).filter(
        (total): total is number => typeof total === "number",
      );
      if (totals.length === 0) return [];

      const nights = Number(quote.nights);
      const lowest = Math.min(...totals);

      return [
        {
          guests: Number(quote.guests),
          nights,
          prices,
          lowest,
          nightly: nightlyPrice(lowest, nights),
        },
      ];
    })
    .sort((a, b) => a.nights - b.nights || a.guests - b.guests);
}

export function shortestStays(stays: PricedStay[]) {
  const nights = Math.min(...stays.map((stay) => stay.nights));

  return stays.filter((stay) => stay.nights === nights);
}

export function referenceStay(stays: PricedStay[]) {
  const shortest = shortestStays(stays);

  return (
    shortest.find((stay) => stay.guests === REFERENCE_GUESTS) ?? shortest[0]
  );
}

export function nightlyRange(stays: PricedStay[]) {
  const rates = shortestStays(stays).map((stay) => stay.nightly);
  if (rates.length === 0) return null;

  return { min: Math.min(...rates), max: Math.max(...rates) };
}

export function formatQuoteDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(date));
}
