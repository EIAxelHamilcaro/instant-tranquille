import { getTranslations } from "next-intl/server";
import { formatDrive } from "@/lib/places";
import { cn } from "@/lib/utils";
import type { Place } from "@/payload-types";

interface PlaceListProps {
  places: Place[];
  className?: string;
}

export async function PlaceList({ places, className }: PlaceListProps) {
  const t = await getTranslations("common");
  const s = await getTranslations("surroundings");

  return (
    <ul className={cn("liste-lieux", className)}>
      {places.map((place) => (
        <li key={place.id}>
          <h3>{place.name}</h3>
          <span className="trajet">
            {formatDrive(place.driveMin)},{" "}
            {t("drive.km", { km: place.driveKm })}
            <span className="sr-only"> {t("drive.byCar")}</span>
          </span>
          {place.commune && (
            <span className="toponyme discret col-span-full">
              {place.commune}
            </span>
          )}
          {place.summary && <p className="description">{place.summary}</p>}
          {place.events && place.events.length > 0 && (
            <ul
              className="rendez-vous col-span-full"
              aria-label={s("eventsLabel", { place: place.name })}
            >
              {place.events.map((event) => (
                <li key={event.id ?? event.name}>
                  {event.name}
                  {event.period && (
                    <span className="discret">, {event.period}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {place.website && (
            <a
              href={place.website}
              className="ui lien col-span-full justify-self-start"
              rel="noopener"
              target="_blank"
            >
              {s("officialSite")}
              <span className="sr-only">
                {" "}
                : {place.name} ({t("opensNewTab")})
              </span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
