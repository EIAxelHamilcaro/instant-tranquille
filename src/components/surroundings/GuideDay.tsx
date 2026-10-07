import { getLocale, getTranslations } from "next-intl/server";
import type { ProgrammeStep } from "@/components/surroundings/guide-content";
import {
  DAY_HORIZON,
  DAY_VIEWBOX,
  dayArc,
} from "@/components/surroundings/guide-illustrations";

interface GuideDayProps {
  steps: ProgrammeStep[];
}

const TICK = 6;
const LABEL_DROP = 23;

export async function GuideDay({ steps }: GuideDayProps) {
  const arc = dayArc(steps.map((step) => step.time));
  const first = steps.at(0);
  const last = steps.at(-1);
  if (!arc || !first || !last) return null;

  const [t, locale] = await Promise.all([
    getTranslations("guides"),
    getLocale(),
  ]);
  const clock = new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    timeZone: "UTC",
  });

  return (
    <figure className="fil-jour">
      <svg viewBox={DAY_VIEWBOX} aria-hidden="true">
        <path className="fil-ciel" d={`${arc.course}Z`} />
        <path className="fil-course" d={arc.course} />
        <path className="fil-horizon" d={`M0 ${DAY_HORIZON}H640`} />
        {arc.ticks.map(({ hour, x }) => (
          <g key={hour}>
            <path className="fil-horizon" d={`M${x} ${DAY_HORIZON}v${TICK}`} />
            <text x={x} y={DAY_HORIZON + LABEL_DROP}>
              {clock.format(new Date(Date.UTC(2026, 0, 1, hour)))}
            </text>
          </g>
        ))}
        <path className="fil-parcours" d={arc.travelled} pathLength={1} />
        {steps.map((step, index) => {
          const point = arc.points[index];

          return (
            point && (
              <path
                key={step.id ?? step.time + step.title}
                className="fil-etape"
                d={`M${point.x} ${point.y}h0`}
              />
            )
          );
        })}
      </svg>
      <figcaption className="ui">
        {t("dayCaption", {
          count: steps.length,
          start: first.time,
          end: last.time,
        })}
      </figcaption>
    </figure>
  );
}
