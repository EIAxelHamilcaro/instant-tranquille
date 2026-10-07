import { Fence, PawPrint } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteSetting } from "@/payload-types";

interface KeyFactsProps {
  settings: SiteSetting;
}

export async function KeyFacts({ settings }: KeyFactsProps) {
  const t = await getTranslations("cottage.facts");
  const { surface, maxGuests, bedrooms, bathrooms, petsAllowed } =
    settings.propertyDetails ?? {};

  const figures = [
    { value: surface, unit: t("surface") },
    { value: maxGuests, unit: t("guests", { count: maxGuests ?? 0 }) },
    { value: bedrooms, unit: t("bedrooms", { count: bedrooms ?? 0 }) },
    { value: bathrooms, unit: t("bathrooms", { count: bathrooms ?? 0 }) },
  ].filter((figure) => figure.value);

  return (
    <ul className="chiffres">
      {figures.map(({ value, unit }) => (
        <li key={unit}>
          <strong>{value}</strong> {unit}
        </li>
      ))}
      <li className="atout">
        <Fence aria-hidden="true" />
        {t("garden")}
      </li>
      {typeof petsAllowed === "boolean" && (
        <li className="atout">
          <PawPrint aria-hidden="true" />
          {t(petsAllowed ? "petsYes" : "petsNo")}
        </li>
      )}
    </ul>
  );
}
