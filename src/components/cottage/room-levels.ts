import type { CottagePage } from "@/payload-types";

export type Room = NonNullable<CottagePage["rooms"]>[number];
export type Level = "ground" | "upstairs" | "outdoors";

export interface LevelGroup {
  level: Level;
  anchor: string;
  rooms: { room: Room; anchor: string }[];
}

const LEVEL_ANCHORS: Record<Level, string> = {
  ground: "rez-de-chaussee",
  upstairs: "etage",
  outdoors: "dehors",
};

const OUTDOOR_NAME = /jardin|terrasse|garden|terrace/i;
const BEDROOM_NAME = /chambre|bedroom/i;

function levelOf(room: Room): Level {
  if (room.level) return room.level;
  if (OUTDOOR_NAME.test(room.name)) return "outdoors";
  if (BEDROOM_NAME.test(room.name)) return "upstairs";

  return "ground";
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function groupByLevel(rooms: Room[]): LevelGroup[] {
  return (Object.keys(LEVEL_ANCHORS) as Level[])
    .map((level) => ({
      level,
      anchor: LEVEL_ANCHORS[level],
      rooms: rooms
        .filter((room) => levelOf(room) === level)
        .map((room) => ({ room, anchor: slugify(room.name) })),
    }))
    .filter((group) => group.rooms.length > 0);
}
