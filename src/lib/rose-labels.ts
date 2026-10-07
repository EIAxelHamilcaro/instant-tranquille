import type { DriveTimeRoseLabels } from "@/components/surroundings/DriveTimeRose";
import { PLACE_CATEGORIES } from "@/lib/places";

type CommonTranslator = (
  key: string,
  values?: Record<string, string>,
) => string;

const DIRECTIONS = [
  "north",
  "northEast",
  "east",
  "southEast",
  "south",
  "southWest",
  "west",
  "northWest",
];

export function roseLabels(t: CommonTranslator): DriveTimeRoseLabels {
  return {
    title: t("rose.title"),
    home: t("rose.home"),
    north: t("rose.north"),
    all: t("rose.all"),
    ring: t("rose.ring", { minutes: "{minutes}" }),
    hint: t("rose.hint"),
    directions: DIRECTIONS.map((direction) =>
      t(`rose.directions.${direction}`),
    ),
    categories: Object.fromEntries(
      PLACE_CATEGORIES.map((category) => [
        category,
        t(`categories.${category}`),
      ]),
    ),
  };
}
