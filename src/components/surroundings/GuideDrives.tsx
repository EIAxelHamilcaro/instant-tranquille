import { getTranslations } from "next-intl/server";
import { formatDrive } from "@/lib/places";
import { cn } from "@/lib/utils";
import type { Place } from "@/payload-types";

interface GuideDrivesProps {
  places: Place[];
  className?: string;
}

const QUARTER = 15;
const MIN_SCALE = 30;
const TRACK = 8;

export async function GuideDrives({ places, className }: GuideDrivesProps) {
  const nearest = places.at(0);
  const farthest = places.at(-1);
  if (places.length < 2 || !nearest || !farthest) return null;

  const [t, common] = await Promise.all([
    getTranslations("guides"),
    getTranslations("common"),
  ]);
  const scale = Math.max(
    MIN_SCALE,
    Math.ceil(farthest.driveMin / QUARTER) * QUARTER,
  );
  const quarters = Array.from(
    { length: scale / QUARTER - 1 },
    (_, index) => (index + 1) * QUARTER,
  );

  return (
    <section className={cn("trajets", className)} aria-labelledby="trajets">
      <h2 id="trajets">{t("drivesTitle")}</h2>
      <p className="ui discret">
        {t("drivesSummary", {
          count: places.length,
          nearest: formatDrive(nearest.driveMin),
          farthest: formatDrive(farthest.driveMin),
        })}
      </p>
      <ol>
        {places.map((place) => (
          <li key={place.id} className={`categorie-${place.category}`}>
            <span className="ui">{place.name}</span>
            <span className="trajet">
              {formatDrive(place.driveMin)}
              <span className="sr-only"> {common("drive.byCar")}</span>
            </span>
            <svg
              viewBox={`0 0 ${scale} ${TRACK}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {quarters.map((quarter) => (
                <path
                  key={quarter}
                  className="trajets-quart"
                  d={`M${quarter} 0v${TRACK}`}
                />
              ))}
              <path
                className="trajets-route"
                d={`M0 ${TRACK / 2}H${place.driveMin}`}
              />
              <path
                className="trajets-lieu"
                d={`M${place.driveMin} ${TRACK / 2}h0`}
              />
            </svg>
          </li>
        ))}
      </ol>
      <p className="legende">{t("drivesLegend")}</p>
    </section>
  );
}
