import type { GeoPoint } from "@/lib/places";
import { SITE_URL } from "@/lib/seo";
import type { RouteServices } from "./position";

const NOMINATIM = "https://nominatim.openstreetmap.org/search";
const OSRM = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_INTERVAL_MS = 1100;
const TIMEOUT_MS = 8000;
const HEADERS = {
  "User-Agent": `linstant-tranquille (${SITE_URL})`,
  "Accept-Language": "fr",
};

let nominatimSlot = 0;

async function nominatimTurn() {
  const wait = Math.max(0, nominatimSlot - Date.now());
  nominatimSlot = Date.now() + wait + NOMINATIM_INTERVAL_MS;
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
}

async function readJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${response.status} from ${url}`);

  return response.json();
}

async function geocode(address: string): Promise<GeoPoint | null> {
  await nominatimTurn();
  const query = new URLSearchParams({
    q: address,
    format: "jsonv2",
    limit: "1",
    countrycodes: "fr",
  });
  const results = (await readJson(`${NOMINATIM}?${query}`)) as
    | { lat: string; lon: string }[]
    | undefined;
  const [first] = results ?? [];
  if (!first) return null;

  const point = { lat: Number(first.lat), lng: Number(first.lon) };

  return Number.isFinite(point.lat) && Number.isFinite(point.lng)
    ? point
    : null;
}

async function route(from: GeoPoint, to: GeoPoint) {
  const path = `${from.lng},${from.lat};${to.lng},${to.lat}`;
  const result = (await readJson(`${OSRM}/${path}?overview=false`)) as {
    routes?: { duration: number; distance: number }[];
  };
  const [best] = result.routes ?? [];
  if (!best) throw new Error("OSRM returned no route");

  return { minutes: best.duration / 60, km: best.distance / 1000 };
}

export const routeServices: RouteServices = { geocode, route };
