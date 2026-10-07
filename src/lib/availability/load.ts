import { unstable_cache } from "next/cache";
import { getPayload } from "@/lib/payload";
import { bookedNights, mergeNights } from "./ical";

export interface Availability {
  taken: string[];
  checkedAt: string;
}

const TWO_HOURS = 7200;
const TIMEOUT_MS = 8000;

async function readCalendar(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "text/calendar" },
  });
  if (!response.ok) throw new Error(`Calendar answered ${response.status}`);

  return bookedNights(await response.text());
}

const loadAvailability = unstable_cache(
  async (): Promise<Availability | null> => {
    const payload = await getPayload();
    const { calendars } = await payload.findGlobal({
      slug: "site-settings",
      depth: 0,
      select: { calendars: true },
    });
    const urls = [calendars?.airbnb, calendars?.booking].filter(
      (url): url is string => Boolean(url),
    );
    if (urls.length === 0) return null;

    return {
      taken: mergeNights(...(await Promise.all(urls.map(readCalendar)))),
      checkedAt: new Date().toISOString(),
    };
  },
  ["availability"],
  { revalidate: TWO_HOURS, tags: ["site-settings", "availability"] },
);

export async function getAvailability(): Promise<Availability | null> {
  try {
    return await loadAvailability();
  } catch (error) {
    const payload = await getPayload();
    payload.logger.warn({
      msg: "Availability calendars could not be read, the section is hidden",
      err: error,
    });

    return null;
  }
}
