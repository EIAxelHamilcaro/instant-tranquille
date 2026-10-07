import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/shared/Photo";
import type {
  PlateFields,
  PlateFormat,
} from "@/components/surroundings/guide-illustrations";
import { formatDrive } from "@/lib/places";
import { cn } from "@/lib/utils";

interface GuidePlateProps {
  fields: PlateFields;
}

const WIDE = "(min-width: 90rem) 864px, (min-width: 64rem) 62vw, 100vw";
const HALF =
  "(min-width: 90rem) 482px, (min-width: 80rem) 34vw, (min-width: 44rem) 55vw, 84vw";

const SIZES: Record<PlateFormat, string> = {
  large: WIDE,
  bande: "(min-width: 44rem) 608px, 100vw",
  marge: "(min-width: 80rem) 240px, (min-width: 44rem) 608px, 100vw",
  paire: HALF,
  trio: HALF,
};

export async function GuidePlate({ fields }: GuidePlateProps) {
  const t = await getTranslations("guides");
  const { format, places } = fields;
  const [first] = places;
  const isAlone = places.length === 1;

  const views = places.map((place) => (
    <figure key={place.id} className={cn("vue", isAlone && `vue-${format}`)}>
      <Photo
        media={place.image}
        sizes={format === "trio" && place === first ? WIDE : SIZES[format]}
        ratio="cadre"
        alt={place.name}
        zoom="photo"
        className="contents"
      />
      <figcaption className="ui">
        {t.rich("plateCaption", {
          place: place.name,
          drive: () => (
            <span className="trajet">{formatDrive(place.driveMin)}</span>
          ),
        })}
      </figcaption>
    </figure>
  ));

  if (isAlone) return views;

  return (
    <div className={cn("planche-guide", `planche-${format}`)}>{views}</div>
  );
}
