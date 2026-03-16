"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CmsSeason } from "@/lib/queries";

type AdditionalFee = {
  name: string;
  amount?: number | null;
  type?: string | null;
  description?: string | null;
};

const colorMap: Record<string, string> = {
  green: "bg-green-100 text-green-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  purple: "bg-purple-100 text-purple-800",
};

function formatPeriod(sm: string, sd: number, em: string, ed: number, locale: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { month: "long", day: "numeric" });
  const start = fmt.format(new Date(2001, parseInt(sm) - 1, sd));
  const end = fmt.format(new Date(2001, parseInt(em) - 1, ed));
  return `${start} — ${end}`;
}

const feeTypeKeys: Record<string, string> = {
  per_stay: "feeTypePerStay",
  per_night: "feeTypePerNight",
  per_person: "feeTypePerPerson",
};

export function PricingTable({
  seasons,
  additionalFees,
  currency,
}: {
  seasons: CmsSeason[];
  additionalFees: AdditionalFee[];
  currency: string;
}) {
  const t = useTranslations("rates");
  const locale = useLocale();

  const symbol = currency === "EUR" ? "\u20AC" : currency;

  if (!seasons.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("tableTitle")} />

        {/* Desktop table */}
        <div className="mx-auto hidden max-w-4xl md:block">
          <Table aria-label={t("tableTitle")}>
            <TableHeader>
              <TableRow className="border-sand-200">
                <TableHead className="font-sans">{t("season")}</TableHead>
                <TableHead className="font-sans">{t("period")}</TableHead>
                <TableHead className="text-right font-sans">
                  {t("perNight")}
                </TableHead>
                <TableHead className="text-right font-sans">
                  {t("perWeek")}
                </TableHead>
                <TableHead className="text-right font-sans">
                  {t("minStay")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seasons.map((season, i) => (
                <TableRow key={i} className="border-sand-200">
                  <TableCell>
                    <Badge
                      className={
                        colorMap[season.color || "green"] || colorMap.green
                      }
                    >
                      {season.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {season.startMonth && season.startDay && season.endMonth && season.endDay
                      ? formatPeriod(season.startMonth, season.startDay, season.endMonth, season.endDay, locale)
                      : ""}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {season.nightlyRate != null ? `${season.nightlyRate}${symbol}` : "—"}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {season.weeklyRate != null ? `${season.weeklyRate}${symbol}` : "—"}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {season.minimumStay != null ? `${season.minimumStay} ${t("nights")}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-4 md:hidden">
          {seasons.map((season, i) => (
            <Card key={i} className="border-sand-200">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Badge
                    className={
                      colorMap[season.color || "green"] || colorMap.green
                    }
                  >
                    {season.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {season.startMonth && season.startDay && season.endMonth && season.endDay
                      ? formatPeriod(season.startMonth, season.startDay, season.endMonth, season.endDay, locale)
                      : ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold">
                      {season.nightlyRate != null ? `${season.nightlyRate}${symbol}` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("perNight")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {season.weeklyRate != null ? `${season.weeklyRate}${symbol}` : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("perWeek")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {season.minimumStay != null ? season.minimumStay : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("minStay")} {t("nights")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional fees */}
        {additionalFees.length > 0 && (
          <div className="mx-auto mt-8 max-w-4xl">
            <h3 className="mb-4 font-heading text-lg font-semibold">
              {t("feesTitle")}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {additionalFees.map((fee, i) => (
                <Card
                  key={i}
                  className="border-sand-200"
                >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-sans text-sm font-medium">{fee.name}</p>
                    {fee.type && feeTypeKeys[fee.type] && (
                      <p className="text-xs text-muted-foreground">
                        {t(feeTypeKeys[fee.type] as "feeTypePerStay" | "feeTypePerNight" | "feeTypePerPerson")}
                      </p>
                    )}
                    {fee.description && (
                      <p className="text-xs text-muted-foreground">
                        {fee.description}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold">
                    {fee.amount != null ? `${fee.amount}${symbol}` : "—"}
                  </p>
                </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            {t("contactCta")}
          </p>
          <Button asChild className="bg-primary-500 text-white font-sans hover:bg-primary-600">
            <Link href={"/contact" as "/"}>{t("contactButton")}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
