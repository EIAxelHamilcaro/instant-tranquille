"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
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

type Season = {
  name: string;
  dateRange?: { start: string; end: string } | null;
  nightlyRate?: number | null;
  weeklyRate?: number | null;
  minimumStay?: number | null;
  color?: string | null;
};

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

export function PricingTable({
  seasons,
  additionalFees,
  currency,
}: {
  seasons: Season[];
  additionalFees: AdditionalFee[];
  currency: string;
}) {
  const t = useTranslations("rates");

  const symbol = currency === "EUR" ? "\u20AC" : currency;

  if (!seasons.length) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("tableTitle")} />

        {/* Desktop table */}
        <div className="mx-auto hidden max-w-4xl md:block">
          <Table>
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
                    {season.dateRange
                      ? `${season.dateRange.start} — ${season.dateRange.end}`
                      : ""}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {season.nightlyRate}
                    {symbol}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {season.weeklyRate}
                    {symbol}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {season.minimumStay} {t("nights")}
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
                    {season.dateRange
                      ? `${season.dateRange.start} — ${season.dateRange.end}`
                      : ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold">
                      {season.nightlyRate}
                      {symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("perNight")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {season.weeklyRate}
                      {symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("perWeek")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">{season.minimumStay}</p>
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
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-sand-200 bg-white p-4"
                >
                  <div>
                    <p className="font-sans text-sm font-medium">{fee.name}</p>
                    {fee.description && (
                      <p className="text-xs text-muted-foreground">
                        {fee.description}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold">
                    {fee.amount}
                    {symbol}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
