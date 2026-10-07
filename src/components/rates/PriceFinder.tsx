"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { GuestFavourite } from "@/components/shared/GuestFavourite";
import { Button } from "@/components/ui/button";
import {
  type BookingPlatform,
  formatPrice,
  isDistinguished,
  nightlyPrice,
  type PricedStay,
} from "@/lib/platforms";

export interface FinderPlatform {
  platform: BookingPlatform;
  name: string;
  url: string;
}

interface PriceFinderProps {
  stays: PricedStay[];
  platforms: FinderPlatform[];
  currency: string;
  defaultGuests: number;
}

const unique = (values: number[]) => [...new Set(values)].sort((a, b) => a - b);

export function PriceFinder({
  stays,
  platforms,
  currency,
  defaultGuests,
}: PriceFinderProps) {
  const locale = useLocale();
  const t = useTranslations("rates.finder");
  const common = useTranslations("common");
  const guestOptions = unique(stays.map((stay) => stay.guests));
  const nightOptions = unique(stays.map((stay) => stay.nights));
  const [guests, setGuests] = useState(defaultGuests);
  const [nights, setNights] = useState(nightOptions[0] ?? 0);

  const stay = stays.find(
    (item) => item.guests === guests && item.nights === nights,
  );
  const price = (amount: number) => formatPrice(amount, currency, locale);

  return (
    <div className="simulateur">
      <fieldset>
        <legend>{t("guestsQuestion")}</legend>
        {guestOptions.map((option) => (
          <Button
            key={option}
            variant="outline"
            size="lg"
            className="pastille"
            aria-pressed={option === guests}
            onClick={() => setGuests(option)}
          >
            {common("rates.guests", { count: option })}
          </Button>
        ))}
      </fieldset>

      <fieldset>
        <legend>{t("nightsQuestion")}</legend>
        {nightOptions.map((option) => (
          <Button
            key={option}
            variant="outline"
            size="lg"
            className="pastille"
            aria-pressed={option === nights}
            onClick={() => setNights(option)}
          >
            {common("rates.nights", { count: option })}
          </Button>
        ))}
      </fieldset>

      <ul className="devis" aria-live="polite">
        {platforms.map(({ platform, name, url }) => {
          const total = stay?.prices[platform];

          return (
            <li key={platform}>
              <h3>{name}</h3>
              {typeof total === "number" ? (
                <p key={`${guests}-${nights}`} className="montant-sejour">
                  <strong>{price(total)}</strong>
                  {t("stay", { nights, guests })}
                  <span>
                    {t("perNight", {
                      price: price(nightlyPrice(total, nights)),
                    })}
                  </span>
                  {total === stay?.lowest &&
                    Object.keys(stay.prices).length > 1 && (
                      <em>{t("lowest")}</em>
                    )}
                </p>
              ) : (
                <p key={`${guests}-${nights}`} className="montant-sejour">
                  {t("notQuoted", { platform: name })}
                </p>
              )}
              <Button asChild size="lg" className={`plateforme-${platform}`}>
                <a href={url} rel="noopener" target="_blank">
                  {common("booking.on", { platform: name })}
                  {isDistinguished(platform) && (
                    <GuestFavourite
                      label={common("booking.guestFavourite")}
                      compact
                    />
                  )}
                  <span className="sr-only"> ({common("opensNewTab")})</span>
                </a>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
