"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CmsSeason } from "@/lib/queries";

const bgColorMap: Record<string, string> = {
  green: "bg-primary-200",
  orange: "bg-earth-200",
  red: "bg-earth-400",
  purple: "bg-primary-500",
};

const badgeColorMap: Record<string, string> = {
  green: "bg-primary-100 text-primary-800 border-primary-200",
  orange: "bg-earth-100 text-earth-800 border-earth-200",
  red: "bg-earth-200 text-earth-900 border-earth-400",
  purple: "bg-primary-200 text-primary-900 border-primary-400",
};

const textColorMap: Record<string, string> = {
  green: "text-foreground",
  orange: "text-foreground",
  red: "text-earth-900",
  purple: "text-white",
};

type DayColor = { color: string; seasonName: string };

function daysInMonth(month: number): number {
  return new Date(2001, month, 0).getDate();
}

function buildDayColorMap(seasons: CmsSeason[]): Map<string, DayColor> {
  const map = new Map<string, DayColor>();

  for (const season of seasons) {
    if (
      !season.startMonth ||
      !season.startDay ||
      !season.endMonth ||
      !season.endDay ||
      !season.color
    )
      continue;

    const sm = parseInt(season.startMonth, 10);
    const sd = season.startDay;
    const em = parseInt(season.endMonth, 10);
    const ed = season.endDay;
    const isCrossYear = sm > em || (sm === em && sd > ed);

    for (let month = 1; month <= 12; month++) {
      const maxDay = daysInMonth(month);
      for (let day = 1; day <= maxDay; day++) {
        let inRange: boolean;
        if (isCrossYear) {
          // e.g. Nov 1 → Mar 31: covers Nov→Dec OR Jan→Mar
          const afterStart = month > sm || (month === sm && day >= sd);
          const beforeEnd = month < em || (month === em && day <= ed);
          inRange = afterStart || beforeEnd;
        } else {
          const afterStart = month > sm || (month === sm && day >= sd);
          const beforeEnd = month < em || (month === em && day <= ed);
          inRange = afterStart && beforeEnd;
        }
        if (inRange) {
          map.set(`${month}-${day}`, {
            color: season.color,
            seasonName: season.name,
          });
        }
      }
    }
  }

  return map;
}

export function SeasonCalendar({
  seasons,
  currency,
}: {
  seasons: CmsSeason[];
  currency: string;
}) {
  const t = useTranslations("rates");
  const locale = useLocale();

  const symbol = currency === "EUR" ? "\u20AC" : currency;

  const dayColorMap = useMemo(() => buildDayColorMap(seasons), [seasons]);

  const monthNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: "short" });
    return Array.from({ length: 12 }, (_, i) =>
      fmt.format(new Date(2001, i, 1)),
    );
  }, [locale]);

  const monthNamesFull = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { month: "long" });
    return Array.from({ length: 12 }, (_, i) =>
      fmt.format(new Date(2001, i, 1)),
    );
  }, [locale]);

  // Only show seasons that have valid date ranges
  const validSeasons = seasons.filter(
    (s) => s.startMonth && s.startDay && s.endMonth && s.endDay && s.color,
  );

  if (!validSeasons.length) return null;

  return (
    <section className="py-16">
      <Container>
        <SectionHeading title={t("calendarTitle")} />

        {/* Legend */}
        <div className="mx-auto mb-8 flex max-w-4xl flex-wrap justify-center gap-3">
          {validSeasons.map((season, i) => (
            <Badge
              key={i}
              className={`gap-2 px-3 py-1.5 text-sm ${badgeColorMap[season.color!] || badgeColorMap.green}`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full ${bgColorMap[season.color!] || bgColorMap.green}`}
              />
              {season.name}
              {season.nightlyRate != null && (
                <span className="font-normal opacity-75">
                  {season.nightlyRate}
                  {symbol}/n
                </span>
              )}
            </Badge>
          ))}
        </div>

        {/* Desktop: 12 columns */}
        <div className="mx-auto hidden max-w-6xl lg:block">
          <div className="grid grid-cols-12 gap-0.5">
            {Array.from({ length: 12 }, (_, monthIdx) => {
              const month = monthIdx + 1;
              const days = daysInMonth(month);
              return (
                <div key={month} className="text-center">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {monthNames[monthIdx]}
                  </div>
                  <div className="flex flex-col gap-px">
                    {Array.from({ length: days }, (_, dayIdx) => {
                      const day = dayIdx + 1;
                      const entry = dayColorMap.get(`${month}-${day}`);
                      const bg = entry
                        ? bgColorMap[entry.color] || "bg-sand-100"
                        : "bg-sand-100";
                      const fg = entry
                        ? textColorMap[entry.color] || "text-foreground"
                        : "text-muted-foreground";
                      return (
                        <div
                          key={day}
                          className={`flex h-[18px] items-center justify-center text-[10px] leading-none ${bg}`}
                          title={`${day} ${monthNamesFull[monthIdx]}${entry?.seasonName ? ` — ${entry.seasonName}` : ""}`}
                        >
                          <span className={fg}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: 3x4 grid of mini calendars */}
        <div className="grid grid-cols-3 gap-3 lg:hidden">
          {Array.from({ length: 12 }, (_, monthIdx) => {
            const month = monthIdx + 1;
            const days = daysInMonth(month);
            // First day of month (0=Sun for JS, we want Mon=0)
            const firstDayOfWeek =
              (new Date(2001, monthIdx, 1).getDay() + 6) % 7;
            return (
              <Card key={month} className="border-sand-200 p-2">
                <CardContent className="p-0">
                  <div className="mb-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {monthNames[monthIdx]}
                  </div>
                  <div className="grid grid-cols-7 gap-px">
                    {/* Empty cells for offset */}
                    {Array.from({ length: firstDayOfWeek }, (_, i) => (
                      <div key={`empty-${i}`} className="h-4" />
                    ))}
                    {Array.from({ length: days }, (_, dayIdx) => {
                      const day = dayIdx + 1;
                      const entry = dayColorMap.get(`${month}-${day}`);
                      const bg = entry
                        ? bgColorMap[entry.color] || "bg-sand-100"
                        : "bg-sand-100";
                      const fg = entry
                        ? textColorMap[entry.color] || "text-foreground"
                        : "text-muted-foreground";
                      return (
                        <div
                          key={day}
                          className={`flex h-4 items-center justify-center rounded-sm text-[8px] leading-none ${bg}`}
                        >
                          <span className={fg}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
