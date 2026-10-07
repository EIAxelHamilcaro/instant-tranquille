export const PLACE_CATEGORIES = [
  "chateaux",
  "equestre",
  "famille",
  "nature",
  "villages",
  "terroir",
  "loire",
  "romorantin",
  "pratique",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface RosePhoto {
  url: string;
  alt: string;
  blurDataURL?: string | null;
  position: string;
}

export interface RosePlace extends GeoPoint {
  photo?: RosePhoto | null;
  commune?: string | null;
  id: string;
  name: string;
  category: PlaceCategory;
  driveMin: number;
  driveKm: number;
  summary?: string | null;
  featured?: boolean | null;
}

export interface PlottedPlace extends RosePlace {
  x: number;
  y: number;
  labelY: number;
  labelled: boolean;
  side: "left" | "right";
}

const roundToHundredth = (value: number) => Math.round(value * 100) / 100;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function bearingFrom(origin: GeoPoint, target: GeoPoint) {
  const deltaLng = toRadians(target.lng - origin.lng);
  const originLat = toRadians(origin.lat);
  const targetLat = toRadians(target.lat);

  const y = Math.sin(deltaLng) * Math.cos(targetLat);
  const x =
    Math.cos(originLat) * Math.sin(targetLat) -
    Math.sin(originLat) * Math.cos(targetLat) * Math.cos(deltaLng);

  return Math.atan2(y, x);
}

interface PlotOptions {
  origin: GeoPoint;
  center: number;
  maxRadius: number;
  maxMinutes: number;
  labelGap: number;
  minDistance: number;
}

interface Point {
  x: number;
  y: number;
}

function spreadPoints<Item extends Point>(points: Item[], minDistance: number) {
  for (let pass = 0; pass < 8; pass++) {
    for (const [index, first] of points.entries()) {
      for (const second of points.slice(index + 1)) {
        const deltaX = second.x - first.x;
        const deltaY = second.y - first.y;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance >= minDistance) continue;

        const push = (minDistance - distance) / 2;
        const unitX = distance === 0 ? 1 : deltaX / distance;
        const unitY = distance === 0 ? 0 : deltaY / distance;

        first.x -= unitX * push;
        first.y -= unitY * push;
        second.x += unitX * push;
        second.y += unitY * push;
      }
    }
  }
}

function stackLabels(
  column: PlottedPlace[],
  gap: number,
  top: number,
  bottom: number,
) {
  const step = Math.min(gap, (bottom - top) / Math.max(column.length - 1, 1));

  let previous = top - step;
  for (const place of column) {
    place.labelY = Math.max(place.y, previous + step);
    previous = place.labelY;
  }

  let next = bottom + step;
  for (const place of [...column].reverse()) {
    place.labelY = roundToHundredth(Math.min(place.labelY, next - step));
    next = place.labelY;
  }
}

function balanceSides(
  labelled: PlottedPlace[],
  center: number,
  capacity: number,
) {
  const count = (side: PlottedPlace["side"]) =>
    labelled.filter((place) => place.side === side).length;

  for (const side of ["left", "right"] as const) {
    const other = side === "left" ? "right" : "left";
    const nearestFirst = labelled
      .filter((place) => place.side === side)
      .sort((a, b) => Math.abs(a.x - center) - Math.abs(b.x - center));

    for (const place of nearestFirst) {
      if (count(side) <= capacity || count(other) >= capacity) break;
      place.side = other;
    }
  }
}

export function plotPlaces(
  places: RosePlace[],
  { origin, center, maxRadius, maxMinutes, labelGap, minDistance }: PlotOptions,
  isLabelled: (place: RosePlace) => boolean = () => true,
): PlottedPlace[] {
  const plotted = places.map((place) => {
    const angle = bearingFrom(origin, place);
    const radius =
      (Math.min(place.driveMin, maxMinutes) / maxMinutes) * maxRadius;
    const x = center + radius * Math.sin(angle);
    const y = center - radius * Math.cos(angle);

    return {
      ...place,
      x,
      y,
      labelY: y,
      labelled: isLabelled(place),
      side: "right" as PlottedPlace["side"],
    };
  });

  spreadPoints(plotted, minDistance);

  for (const place of plotted) {
    place.x = roundToHundredth(place.x);
    place.y = roundToHundredth(place.y);
    place.side = place.x >= center ? "right" : "left";
  }

  const top = center - maxRadius;
  const bottom = center + maxRadius;
  const labelled = plotted.filter((place) => place.labelled);

  balanceSides(labelled, center, Math.floor((bottom - top) / labelGap) + 1);

  for (const side of ["left", "right"] as const) {
    const column = labelled
      .filter((place) => place.side === side)
      .sort((a, b) => a.y - b.y);

    stackLabels(column, labelGap, top, bottom);
  }

  return plotted;
}

export interface RingTick {
  x: number;
  y: number;
  anchor: "start" | "end";
}

interface TickOptions {
  center: number;
  width: number;
  height: number;
  clearance: number;
}

type Way = 1 | -1;

const TICK_INSET = 6;

const TICK_LAYOUTS: { vertical: Way; preferred: Way }[] = [
  { vertical: 1, preferred: 1 },
  { vertical: 1, preferred: -1 },
  { vertical: -1, preferred: 1 },
  { vertical: -1, preferred: -1 },
];

export function placeRingTicks(
  radii: number[],
  obstacles: Point[],
  { center, width, height, clearance }: TickOptions,
): RingTick[] {
  const tickAt = (radius: number, vertical: Way, horizontal: Way) => {
    const x = center + horizontal * TICK_INSET;
    const edge = center + vertical * (radius - TICK_INSET);
    const left = Math.min(x, x + horizontal * width) - clearance;
    const right = Math.max(x, x + horizontal * width) + clearance;
    const top = Math.min(edge, edge - vertical * height) - clearance;
    const bottom = Math.max(edge, edge - vertical * height) + clearance;

    return {
      x,
      y: roundToHundredth(vertical === 1 ? edge : edge + height * 0.7),
      anchor: horizontal === 1 ? ("start" as const) : ("end" as const),
      covered: obstacles.some(
        (point) =>
          point.x > left &&
          point.x < right &&
          point.y > top &&
          point.y < bottom,
      ),
      flipped: false,
    };
  };

  const layouts = TICK_LAYOUTS.map(({ vertical, preferred }) => {
    const ticks = radii.map((radius) => {
      const tick = tickAt(radius, vertical, preferred);
      if (!tick.covered) return tick;

      const opposite = tickAt(radius, vertical, preferred === 1 ? -1 : 1);

      return opposite.covered ? tick : { ...opposite, flipped: true };
    });
    const count = (flaw: "covered" | "flipped") =>
      ticks.filter((tick) => tick[flaw]).length;

    return { ticks, cost: count("covered") * radii.length + count("flipped") };
  });

  const [first, ...others] = layouts;
  if (!first) return [];

  const clearest = others.reduce(
    (best, layout) => (layout.cost < best.cost ? layout : best),
    first,
  );

  return clearest.ticks.map(({ x, y, anchor }) => ({ x, y, anchor }));
}

export function formatDrive(minutes: number) {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0
    ? `${hours} h`
    : `${hours} h ${String(rest).padStart(2, "0")}`;
}
