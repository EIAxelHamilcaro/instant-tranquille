import {
  type LexicalNode,
  nodeText,
} from "@/components/surroundings/guide-content";
import type { Guide, Place } from "@/payload-types";

export type PlateFormat = "large" | "bande" | "marge" | "paire" | "trio";

export interface PlateFields {
  blockType: "planche";
  format: PlateFormat;
  places: Place[];
}

export interface DayPoint {
  x: number;
  y: number;
}

export interface DayArc {
  course: string;
  travelled: string;
  points: DayPoint[];
  ticks: { x: number; hour: number }[];
}

type Amount = { value: number; unit: string } | null;

const GENERIC_WORDS = new Set(
  "a au aux d de des du en et l la le les sur sous the of and chateau chateaux royal domaine parc zoo zooparc musee museum espace maison office tourisme tourist marche market complexe centre center ville village foret etang lac eglise abbaye cathedrale gare golf circuit base port sologne romorantin lanthenay loire cher val saint sainte".split(
    " ",
  ),
);

const MAX_PLATE = 4;
const MARGIN_TEXT = 600;

const DAY_START = 6 * 60;
const DAY_END = 22 * 60;
const TICK_HOURS = [6, 10, 14, 18, 22];
const ARC = { left: 34, right: 606, horizon: 128, height: 104 };

const BAR_UNITS = ["€", "km", "min"];
const MIN_BARS = 3;
const MIN_BAR_SHARE = 0.6;

export const DAY_VIEWBOX = "0 0 640 156";
export const DAY_HORIZON = ARC.horizon;

function plain(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const within = (haystack: string, needle: string) =>
  needle.length > 0 && ` ${haystack} `.includes(` ${needle} `);

function distinctiveWords(name: string) {
  return plain(name)
    .split(" ")
    .filter((word) => word.length > 2 && !GENERIC_WORDS.has(word));
}

function namedIn(heading: string, place: Place) {
  if (within(heading, plain(place.name))) return true;

  const words = distinctiveWords(place.name);

  return words.length > 0 && words.every((word) => within(heading, word));
}

const address = (url: string) =>
  url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[/#?]+$/, "")
    .toLowerCase();

function linksTo(node: LexicalNode, website: string): boolean {
  if (node.type === "link" && typeof node.fields?.url === "string") {
    return address(node.fields.url) === website;
  }

  return (node.children ?? []).some((child) => linksTo(child, website));
}

function mentions(node: LexicalNode, place: Place) {
  if (place.website && linksTo(node, address(place.website))) return true;

  return within(plain(nodeText(node)), plain(place.name));
}

const isHeading = (node: LexicalNode | undefined) => node?.type === "heading";

function anchorOf(nodes: LexicalNode[], place: Place) {
  const heading = nodes.findIndex(
    (node) => isHeading(node) && namedIn(plain(nodeText(node)), place),
  );

  if (heading >= 0) {
    return nodes[heading + 1]?.type === "paragraph" ? heading + 1 : heading;
  }

  const firstHeading = nodes.findIndex(isHeading);
  if (firstHeading < 0) return -1;

  return nodes.findIndex(
    (node, index) =>
      index > firstHeading && !isHeading(node) && mentions(node, place),
  );
}

function hasMargin(nodes: LexicalNode[], anchor: number) {
  const rest = nodes.slice(isHeading(nodes[anchor]) ? anchor + 1 : anchor);
  const stop = rest.findIndex(
    (node) => node.type === "table" || (isHeading(node) && node.tag === "h2"),
  );
  const beside = stop < 0 ? rest : rest.slice(0, stop);

  return beside.map(nodeText).join(" ").length >= MARGIN_TEXT;
}

function plateFormat(
  nodes: LexicalNode[],
  anchor: number,
  count: number,
  previous: PlateFormat | undefined,
): PlateFormat {
  if (count === 3) return "trio";
  if (count > 1) return "paire";
  if (previous !== "large") return "large";

  return hasMargin(nodes, anchor) ? "marge" : "bande";
}

export function illustrateBody(
  body: Guide["body"],
  places: Place[],
): Guide["body"] {
  const nodes = body.root.children as LexicalNode[];
  const plates = new Map<number, Place[]>();

  for (const place of places) {
    if (typeof place.image !== "object" || !place.image?.url) continue;

    const anchor = anchorOf(nodes, place);
    if (anchor < 0) continue;

    const plate = plates.get(anchor) ?? [];
    if (plate.length < MAX_PLATE) plates.set(anchor, [...plate, place]);
  }

  if (plates.size === 0) return body;

  let previous: PlateFormat | undefined;

  const children = body.root.children.flatMap((node, index) => {
    const plate = plates.get(index);
    if (!plate) return [node];

    const format = plateFormat(nodes, index, plate.length, previous);
    const fields: PlateFields = { blockType: "planche", format, places: plate };
    const block = { type: "block", version: 1, fields };

    previous = format;

    return format === "marge" && !isHeading(nodes[index])
      ? [block, node]
      : [node, block];
  });

  return { ...body, root: { ...body.root, children } };
}

export function stepMinutes(time: string) {
  const match = /(\d{1,2})(?:\s*[h.:]\s*(\d{2}))?\s*(am|pm|noon)?/i.exec(time);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const period = match[3]?.toLowerCase();
  const shift =
    (period === "pm" && hours < 12 ? 12 : 0) -
    (period === "am" && hours === 12 ? 12 : 0);

  return (hours + shift) * 60 + minutes;
}

function arcPoint(minutes: number): DayPoint {
  const share = Math.min(
    1,
    Math.max(0, (minutes - DAY_START) / (DAY_END - DAY_START)),
  );

  return {
    x: ARC.left + share * (ARC.right - ARC.left),
    y: ARC.horizon - ARC.height * 4 * share * (1 - share),
  };
}

const fixed = (value: number) => Number(value.toFixed(1));

function arcPath(from: number, to: number) {
  const steps = 24;
  const points = Array.from({ length: steps + 1 }, (_, index) =>
    arcPoint(from + ((to - from) * index) / steps),
  );

  return points
    .map(({ x, y }, index) => `${index ? "L" : "M"}${fixed(x)} ${fixed(y)}`)
    .join("");
}

export function dayArc(times: string[]): DayArc | null {
  const minutes = times.map(stepMinutes);
  if (minutes.length < 2 || minutes.some((value) => value === null)) {
    return null;
  }

  const moments = minutes as number[];

  return {
    course: arcPath(DAY_START, DAY_END),
    travelled: arcPath(Math.min(...moments), Math.max(...moments)),
    points: moments.map(arcPoint).map(({ x, y }) => ({
      x: fixed(x),
      y: fixed(y),
    })),
    ticks: TICK_HOURS.map((hour) => ({
      hour,
      x: fixed(arcPoint(hour * 60).x),
    })),
  };
}

function amount(text: string): Amount {
  const match =
    /^(?:environ |about |around )?(?:(€)\s?(\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?)\s?(€|km|min))(?=$|\s*[,;(])/i.exec(
      text.trim(),
    );
  if (!match) return null;

  const [, prefix, prefixed, value, unit] = match;

  return {
    value: Number((prefixed ?? value ?? "").replace(",", ".")),
    unit: (prefix ?? unit ?? "").toLowerCase(),
  };
}

export function columnBars(rows: string[][]): (number | null)[][] {
  const width = Math.max(0, ...rows.map((row) => row.length));
  const columns = Array.from({ length: width }, (_, column) => {
    const amounts = rows.map((row) => amount(row[column] ?? ""));
    const unit = BAR_UNITS.find(
      (candidate) =>
        amounts.filter((cell) => cell?.unit === candidate).length >= MIN_BARS,
    );
    const measured = amounts.filter((cell) => cell?.unit === unit);
    const highest = Math.max(0, ...measured.map((cell) => cell?.value ?? 0));

    if (!unit || highest === 0) return amounts.map(() => null);
    if (measured.length < rows.length * MIN_BAR_SHARE) {
      return amounts.map(() => null);
    }

    return amounts.map((cell) =>
      cell?.unit === unit ? Math.round((cell.value / highest) * 100) : null,
    );
  });

  return rows.map((_, row) => columns.map((column) => column[row] ?? null));
}
