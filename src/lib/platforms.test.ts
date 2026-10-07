import { describe, expect, test } from "bun:test";
import { nightlyRange, nightlyRates, referenceRate } from "@/lib/platforms";
import type { PricingConfig } from "@/payload-types";

const pricing = (rows: unknown[]) =>
  ({ nightlyRates: rows }) as unknown as PricingConfig;

describe("base prices per night", () => {
  const rates = nightlyRates(
    pricing([
      { guests: "6", price: 120 },
      { guests: "2", price: 100 },
      { guests: "4", price: 110 },
    ]),
  );

  test("given rows in any order, when read, then they are sorted by number of guests and never multiplied by a number of nights", () => {
    expect(rates).toEqual([
      { guests: 2, price: 100 },
      { guests: 4, price: 110 },
      { guests: 6, price: 120 },
    ]);
  });

  test("given a price for 4 guests, when the headline price is picked, then it is the one for 4 guests", () => {
    expect(referenceRate(rates)).toEqual({ guests: 4, price: 110 });
  });

  test("given no price for 4 guests, when the headline price is picked, then it is the one for the fewest guests", () => {
    expect(referenceRate(rates.filter((rate) => rate.guests !== 4))).toEqual({
      guests: 2,
      price: 100,
    });
  });

  test("given three prices, when the range is read, then it runs from the cheapest row to the dearest", () => {
    expect(nightlyRange(rates)).toEqual({ min: 100, max: 120 });
  });

  test("given a draft row without a price, when read, then it is left out", () => {
    expect(nightlyRates(pricing([{ guests: "2", price: null }]))).toEqual([]);
    expect(referenceRate([])).toBeUndefined();
    expect(nightlyRange([])).toBe(null);
  });
});
