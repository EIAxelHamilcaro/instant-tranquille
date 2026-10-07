import { describe, expect, test } from "bun:test";
import { occupancyRate, upcomingStays } from "./occupancy";

const TODAY = "2026-10-07";

describe("occupancyRate", () => {
  test("given nights inside and outside the window, when measured over 30 days, then only the nights from today to day 30 count", () => {
    const taken = [
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-11-05",
      "2026-11-06",
    ];

    expect(occupancyRate(taken, TODAY, 30)).toEqual({
      occupied: 3,
      days: 30,
      rate: 10,
    });
  });
});

describe("upcomingStays", () => {
  test("given consecutive nights, when grouped, then each run becomes one stay that ends the morning after its last night", () => {
    const taken = ["2026-10-10", "2026-10-11", "2026-10-12", "2026-10-20"];

    expect(upcomingStays(taken, TODAY, 5)).toEqual([
      {
        arrival: "2026-10-10",
        departure: "2026-10-13",
        nights: 3,
        isOngoing: false,
      },
      {
        arrival: "2026-10-20",
        departure: "2026-10-21",
        nights: 1,
        isOngoing: false,
      },
    ]);
  });

  test("given a stay that started before today and one that is over, when grouped, then the first is kept as ongoing and the second dropped", () => {
    const taken = [
      "2026-10-01",
      "2026-10-02",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
    ];

    expect(upcomingStays(taken, TODAY, 5)).toEqual([
      {
        arrival: "2026-10-06",
        departure: "2026-10-09",
        nights: 3,
        isOngoing: true,
      },
    ]);
  });

  test("given more stays than the limit, when grouped, then only the nearest ones are returned", () => {
    const taken = ["2026-10-10", "2026-10-12", "2026-10-14"];

    expect(upcomingStays(taken, TODAY, 2).map((stay) => stay.arrival)).toEqual([
      "2026-10-10",
      "2026-10-12",
    ]);
  });
});
