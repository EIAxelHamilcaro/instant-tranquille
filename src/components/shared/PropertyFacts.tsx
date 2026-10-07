import { getTranslations } from "next-intl/server";
import type { SiteSetting } from "@/payload-types";

interface PropertyFactsProps {
  settings: SiteSetting;
}

export async function PropertyFacts({ settings }: PropertyFactsProps) {
  const t = await getTranslations("common.facts");
  const property = settings.propertyDetails;

  const facts = [
    [t("guests"), t("guestsValue", { count: property?.maxGuests ?? 0 })],
    [t("bedrooms"), property?.bedrooms],
    [t("bathrooms"), t("bathroomsValue", { count: property?.bathrooms ?? 0 })],
    [t("surface"), t("surfaceValue", { count: property?.surface ?? 0 })],
    [t("garden"), t("gardenValue")],
    [t("pets"), property?.petsAllowed ? t("petsYes") : t("petsNo")],
  ].filter(([, value]) => value);

  return (
    <dl className="fiche">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
