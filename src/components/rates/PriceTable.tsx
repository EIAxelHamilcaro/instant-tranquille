import { getLocale, getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BOOKING_PLATFORM_NAMES,
  BOOKING_PLATFORMS,
  formatPrice,
  formatQuoteDate,
  pricedStays,
} from "@/lib/platforms";
import type { PricingConfig } from "@/payload-types";

interface PriceTableProps {
  pricing: PricingConfig;
}

export async function PriceTable({ pricing }: PriceTableProps) {
  const locale = await getLocale();
  const t = await getTranslations("rates.table");
  const common = await getTranslations("common.rates");
  const currency = pricing.currency || "EUR";
  const price = (amount: number) => formatPrice(amount, currency, locale);

  return (
    <Table className="tarifs">
      <TableCaption>
        {t("caption")}
        {pricing.quotedOn &&
          ` ${common("quoted", { date: formatQuoteDate(pricing.quotedOn, locale) })}`}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">{t("stay")}</TableHead>
          {BOOKING_PLATFORMS.map((platform) => (
            <TableHead key={platform} scope="col">
              {BOOKING_PLATFORM_NAMES[platform]}
            </TableHead>
          ))}
          <TableHead scope="col">{t("perNight")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pricedStays(pricing).map((stay) => (
          <TableRow key={`${stay.nights}-${stay.guests}`}>
            <TableHead scope="row">
              {common("nights", { count: stay.nights })}
              <small>{common("guests", { count: stay.guests })}</small>
            </TableHead>
            {BOOKING_PLATFORMS.map((platform) => {
              const total = stay.prices[platform];

              return (
                <TableCell key={platform} className="prix">
                  {typeof total === "number" ? price(total) : t("notQuoted")}
                </TableCell>
              );
            })}
            <TableCell>{price(stay.nightly)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
