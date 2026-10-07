import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { Vignette } from "@/components/surroundings/Vignette";
import { formatDrive } from "@/lib/places";
import { cn } from "@/lib/utils";
import type { Place } from "@/payload-types";

interface PlaceCardsProps {
  places: Place[];
  showEvents?: boolean;
  uniform?: boolean;
  className?: string;
}

export async function PlaceCards({
  places,
  showEvents = true,
  uniform = false,
  className,
}: PlaceCardsProps) {
  const t = await getTranslations("common");
  const s = await getTranslations("surroundings");
  const isLarge = (place: Place) => !uniform && Boolean(place.featured);
  const ordered = [
    ...places.filter(isLarge),
    ...places.filter((place) => !isLarge(place)),
  ];

  return (
    <PhotoViewer>
      <ul
        className={cn(
          "cartes cartes-lieux",
          uniform && "cartes-duo",
          className,
        )}
      >
        {ordered.map((place) => (
          <li
            key={place.id}
            className={cn(
              "carte carte-lieu",
              isLarge(place) && "carte-vedette",
            )}
          >
            <Vignette
              media={place.image}
              category={place.category}
              zoom={place.website ? "loupe" : "photo"}
              sizes={
                isLarge(place)
                  ? "(min-width: 64rem) 620px, 100vw"
                  : "(min-width: 64rem) 300px, (min-width: 40rem) 50vw, 120px"
              }
            />
            <h3>{place.name}</h3>
            <p className="etiquette">
              {formatDrive(place.driveMin)}
              <span className="sr-only"> {t("drive.byCar")}</span>
            </p>
            <p className="toponyme discret">
              {place.commune ? `${place.commune}, ` : ""}
              {t("drive.km", { km: place.driveKm })}
            </p>
            {place.summary && <p className="description">{place.summary}</p>}
            {showEvents && place.events && place.events.length > 0 && (
              <ul
                className="rendez-vous"
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
                className="ui lien lien-officiel"
                rel="noopener"
                target="_blank"
              >
                {s("officialSite")}
                <span className="sr-only">
                  {" "}
                  : {place.name} ({t("opensNewTab")})
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </PhotoViewer>
  );
}
