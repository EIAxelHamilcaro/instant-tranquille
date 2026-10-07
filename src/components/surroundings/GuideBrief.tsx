import {
  Baby,
  Banknote,
  CalendarDays,
  CalendarX,
  Clock,
  CloudRain,
  Euro,
  type LucideIcon,
  PawPrint,
  Route,
  Snowflake,
  Sprout,
  SquareParking,
  Ticket,
} from "lucide-react";
import type { Guide } from "@/payload-types";

interface GuideBriefProps {
  items: NonNullable<Guide["practical"]>;
}

const PICTOGRAMS: [RegExp, LucideIcon][] = [
  [/éviter|avoid/i, CalendarX],
  [/parking/i, SquareParking],
  [/péage|toll/i, Banknote],
  [/chien|dog/i, PawPrint],
  [/enfant|child/i, Baby],
  [/pleut|pluie|rain/i, CloudRain],
  [/hiver|winter/i, Snowflake],
  [/réserver|book/i, Ticket],
  [/budget|tarif|prix|price|admission/i, Euro],
  [/route|driving|proche|closest|où|where/i, Route],
  [/durée|how long|horaire|hours/i, Clock],
  [/jour|day|quand|when|saison|season/i, CalendarDays],
];

const pictogram = (label: string) =>
  PICTOGRAMS.find(([pattern]) => pattern.test(label))?.[1] ?? Sprout;

export function GuideBrief({ items }: GuideBriefProps) {
  return (
    <dl>
      {items.map(({ id, label, value }) => {
        const Pictogram = pictogram(label);

        return (
          <div key={id ?? label}>
            <dt>
              <Pictogram aria-hidden="true" />
              {label}
            </dt>
            <dd>{value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
