import { getLocale, getTranslations } from "next-intl/server";
import { BookingButtons } from "@/components/shared/BookingButtons";
import {
  buildMonths,
  type CalendarMonth,
  todayInParis,
} from "@/lib/availability/ical";
import type { Availability as AvailabilityData } from "@/lib/availability/load";
import type { SiteSetting } from "@/payload-types";

interface AvailabilityProps {
  availability: AvailabilityData;
  minimumStay: number;
  settings: SiteSetting;
}

const MONTHS_SHOWN = 6;
const MONDAY = Date.UTC(2024, 0, 1);
const DAY_MS = 86_400_000;

const weeksOf = ({ offset, days }: CalendarMonth) => {
  const cells = [...Array<null>(offset).fill(null), ...days];

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
};

export async function Availability({
  availability,
  minimumStay,
  settings,
}: AvailabilityProps) {
  const locale = await getLocale();
  const t = await getTranslations("rates.availability");
  const today = todayInParis();
  const months = buildMonths({
    taken: availability.taken,
    today,
    months: MONTHS_SHOWN,
    minimumStay,
  });
  const monthName = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const fullDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeZone: "UTC",
  });
  const checkedOn = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "Europe/Paris",
  });
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(MONDAY + index * DAY_MS);

    return {
      short: new Intl.DateTimeFormat(locale, {
        weekday: "narrow",
        timeZone: "UTC",
      }).format(day),
      long: new Intl.DateTimeFormat(locale, {
        weekday: "long",
        timeZone: "UTC",
      }).format(day),
    };
  });

  return (
    <section className="disponibilites page section grid gap-y-10">
      <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <h2 className="lg:col-span-6">{t("title")}</h2>
        <div className="texte lg:col-span-6">
          <p className="chapeau">{t("intro", { count: MONTHS_SHOWN })}</p>
          <ul className="legende-nuits ui flex flex-wrap gap-x-6 gap-y-2">
            <li data-etat="free">{t("free")}</li>
            <li data-etat="taken">{t("taken")}</li>
          </ul>
        </div>
      </div>

      <div className="calendrier-nuits grid sm:grid-cols-2 lg:grid-cols-3">
        {months.map((month) => (
          <table key={month.key} className="mois">
            <caption>{monthName.format(new Date(`${month.key}-01`))}</caption>
            <thead>
              <tr>
                {weekdays.map(({ short, long }) => (
                  <th key={long} scope="col" abbr={long}>
                    {short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeksOf(month).map((week) => (
                <tr key={week.find((day) => day)?.date}>
                  {week.map((day, index) =>
                    day ? (
                      <td
                        key={day.date}
                        data-etat={day.state}
                        aria-current={day.date === today ? "date" : undefined}
                      >
                        <time
                          dateTime={day.date}
                          title={fullDate.format(new Date(day.date))}
                        >
                          {day.day}
                        </time>
                        <span className="sr-only">, {t(day.state)}</span>
                      </td>
                    ) : (
                      <td key={`${month.key}-vide-${index}`} />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>

      <div className="grid gap-6">
        <p className="discret texte">
          {t("note", {
            count: minimumStay,
            date: checkedOn.format(new Date(availability.checkedAt)),
          })}
        </p>
        <BookingButtons settings={settings} />
      </div>
    </section>
  );
}
