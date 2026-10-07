import { describe, expect, test } from "bun:test";
import { bookedNights, buildMonths, mergeNights, todayInParis } from "./ical";

const calendar = (...events: string[]) =>
  ["BEGIN:VCALENDAR", "VERSION:2.0", ...events, "END:VCALENDAR"].join("\r\n");

const event = (...lines: string[]) =>
  ["BEGIN:VEVENT", ...lines, "END:VEVENT"].join("\r\n");

describe("bookedNights", () => {
  test("given an all-day booking, when read, then the departure day stays free because DTEND is exclusive", () => {
    const nights = bookedNights(
      calendar(
        event("DTSTART;VALUE=DATE:20261010", "DTEND;VALUE=DATE:20261013"),
      ),
    );

    expect(nights).toEqual(["2026-10-10", "2026-10-11", "2026-10-12"]);
  });

  test("given a booking written in UTC, when read, then nights are counted in Paris time", () => {
    const nights = bookedNights(
      calendar(event("DTSTART:20261024T220000Z", "DTEND:20261026T090000Z")),
    );

    expect(nights).toEqual(["2026-10-25"]);
  });

  test("given folded lines and a cancelled booking, when read, then the fold is joined and the cancellation ignored", () => {
    const nights = bookedNights(
      calendar(
        event(
          "SUMMARY:Reserved",
          "DTSTART;VALUE=DATE:2026",
          " 1101",
          "DTEND;VALUE=DATE:20261102",
        ),
        event(
          "STATUS:CANCELLED",
          "DTSTART;VALUE=DATE:20261105",
          "DTEND;VALUE=DATE:20261108",
        ),
      ),
    );

    expect(nights).toEqual(["2026-11-01"]);
  });

  test("given something that is not a calendar, when read, then it is rejected instead of looking fully available", () => {
    expect(() => bookedNights("<html>Sign in</html>")).toThrow();
    expect(() => bookedNights(calendar(event("DTSTART:not-a-date")))).toThrow();
  });
});

describe("mergeNights", () => {
  test("given overlapping bookings on two platforms, when merged, then a night is taken as soon as one platform has it", () => {
    const airbnb = ["2026-10-10", "2026-10-11"];
    const booking = ["2026-10-11", "2026-10-12"];

    expect(mergeNights(airbnb, booking)).toEqual([
      "2026-10-10",
      "2026-10-11",
      "2026-10-12",
    ]);
  });
});

describe("buildMonths", () => {
  const months = buildMonths({
    taken: ["2026-10-10", "2026-10-11", "2026-10-13", "2026-10-31"],
    today: "2026-10-06",
    months: 2,
    minimumStay: 2,
  });
  const stateOf = (date: string) =>
    months.flatMap((month) => month.days).find((day) => day.date === date)
      ?.state;

  test("given a two-night minimum, when one free night sits between two bookings, then it is shown as taken", () => {
    expect(stateOf("2026-10-12")).toBe("taken");
    expect(stateOf("2026-10-14")).toBe("free");
  });

  test("given today, when the month is built, then earlier days are past and the grid starts on the right weekday", () => {
    expect(stateOf("2026-10-05")).toBe("past");
    expect(stateOf("2026-10-06")).toBe("free");
    expect(months[0]?.offset).toBe(3);
    expect(months[1]?.key).toBe("2026-11");
    expect(months[1]?.days).toHaveLength(30);
  });

  test("given free nights at the end of the window, when built, then they stay free even if fewer than the minimum remain", () => {
    expect(stateOf("2026-11-30")).toBe("free");
  });
});

describe("todayInParis", () => {
  test("given a late evening in UTC, when asked for today, then Paris is already on the next day", () => {
    expect(todayInParis(new Date("2026-10-06T22:30:00Z"))).toBe("2026-10-07");
  });
});
