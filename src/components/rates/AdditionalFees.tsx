import { getLocale, getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import type { PricingConfig } from "@/payload-types";

interface AdditionalFeesProps {
  pricing: PricingConfig;
  className?: string;
}

export async function AdditionalFees({
  pricing,
  className,
}: AdditionalFeesProps) {
  const locale = await getLocale();
  const t = await getTranslations("rates.fees");
  const currency = pricing.currency || "EUR";

  return (
    <ul className={cn("frais", className)}>
      {(pricing.additionalFees ?? []).map((fee) => (
        <li key={fee.id ?? fee.name}>
          <h3>{fee.name}</h3>
          <p className="montant">
            {t(fee.type ?? "flat", {
              amount: formatPrice(fee.amount, currency, locale),
            })}
          </p>
          {fee.description && <p className="discret">{fee.description}</p>}
        </li>
      ))}
    </ul>
  );
}
