import { toDayNumber, toIsoDate } from "./ical";

export interface Stay {
  arrival: string;
  departure: string;
  nights: number;
  isOngoing: boolean;
}

export function occupancyRate(taken: string[], today: string, days: number) {
  const first = toDayNumber(today);
  const nights = new Set(taken.map(toDayNumber));
  const occupied = Array.from(
    { length: days },
    (_, offset) => first + offset,
  ).filter((night) => nights.has(night)).length;

  return { occupied, days, rate: Math.round((occupied / days) * 100) };
}

export function upcomingStays(taken: string[], today: string, limit: number) {
  const first = toDayNumber(today);
  const nights = [...new Set(taken.map(toDayNumber))].sort((a, b) => a - b);
  const runs: number[][] = [];

  for (const night of nights) {
    const current = runs.at(-1);
    if (current && current.at(-1) === night - 1) current.push(night);
    else runs.push([night]);
  }

  return runs
    .filter((run) => (run.at(-1) ?? 0) >= first)
    .slice(0, limit)
    .map((run): Stay => {
      const arrival = run[0] ?? first;

      return {
        arrival: toIsoDate(arrival),
        departure: toIsoDate(arrival + run.length),
        nights: run.length,
        isOngoing: arrival < first,
      };
    });
}
