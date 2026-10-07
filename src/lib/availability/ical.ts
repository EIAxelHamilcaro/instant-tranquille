const DAY_MS = 86_400_000;
const TIME_ZONE = "Europe/Paris";

const parisDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const toDayNumber = (isoDate: string) => {
  const [year = 0, month = 1, day = 1] = isoDate.split("-").map(Number);

  return Date.UTC(year, month - 1, day) / DAY_MS;
};

export const toIsoDate = (dayNumber: number) =>
  new Date(dayNumber * DAY_MS).toISOString().slice(0, 10);

export const todayInParis = (now = new Date()) => parisDate.format(now);

function dayOf(value: string): number | null {
  const match = value
    .trim()
    .match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/);
  if (!match) return null;

  const [, year, month, day, hours, minutes, seconds, isUtc] = match;
  if (!isUtc) return toDayNumber(`${year}-${month}-${day}`);

  const instant = new Date(
    `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`,
  );

  return toDayNumber(parisDate.format(instant));
}

function property(event: string, name: string) {
  const line = event
    .split("\n")
    .find((entry) => new RegExp(`^${name}[;:]`, "i").test(entry));

  return line ? line.slice(line.indexOf(":") + 1) : null;
}

export function bookedNights(calendar: string): string[] {
  const unfolded = calendar.replace(/\r\n?/g, "\n").replace(/\n[ \t]/g, "");
  if (!/^BEGIN:VCALENDAR/im.test(unfolded))
    throw new Error("Not an iCalendar file");

  const events = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/gi) ?? [];
  const nights = new Set<number>();

  for (const event of events) {
    if (/^STATUS:CANCELLED/im.test(event)) continue;

    const start = dayOf(property(event, "DTSTART") ?? "");
    if (start === null) throw new Error("Event without a readable DTSTART");

    const end = dayOf(property(event, "DTEND") ?? "") ?? start + 1;
    for (let night = start; night < end; night += 1) nights.add(night);
  }

  return [...nights].sort((a, b) => a - b).map(toIsoDate);
}

export const mergeNights = (...calendars: string[][]) =>
  [...new Set(calendars.flat())].sort();

export type NightState = "past" | "taken" | "free";

export interface CalendarDay {
  date: string;
  day: number;
  state: NightState;
}

export interface CalendarMonth {
  key: string;
  offset: number;
  days: CalendarDay[];
}

interface MonthsRequest {
  taken: string[];
  today: string;
  months: number;
  minimumStay: number;
}

export function buildMonths({
  taken,
  today,
  months,
  minimumStay,
}: MonthsRequest): CalendarMonth[] {
  const first = toDayNumber(`${today.slice(0, 7)}-01`);
  const todayNumber = toDayNumber(today);
  const start = new Date(first * DAY_MS);
  const end =
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + months, 1) / DAY_MS;
  const occupied = new Set(taken.map(toDayNumber));
  const states = new Map<number, NightState>();

  let run: number[] = [];
  const closeRun = (isOpenEnded: boolean) => {
    const isTooShort = !isOpenEnded && run.length < minimumStay;
    for (const night of run) states.set(night, isTooShort ? "taken" : "free");
    run = [];
  };

  for (let night = first; night < end; night += 1) {
    if (night < todayNumber) {
      states.set(night, "past");
      continue;
    }
    if (occupied.has(night)) {
      closeRun(false);
      states.set(night, "taken");
      continue;
    }
    run.push(night);
  }
  closeRun(true);

  return Array.from({ length: months }, (_, index) => {
    const opening = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index, 1),
    );
    const closing = Date.UTC(
      opening.getUTCFullYear(),
      opening.getUTCMonth() + 1,
      1,
    );
    const firstDay = opening.getTime() / DAY_MS;
    const length = closing / DAY_MS - firstDay;

    return {
      key: opening.toISOString().slice(0, 7),
      offset: (opening.getUTCDay() + 6) % 7,
      days: Array.from({ length }, (_, day) => ({
        date: toIsoDate(firstDay + day),
        day: day + 1,
        state: states.get(firstDay + day) ?? "free",
      })),
    };
  });
}
