import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";

interface StatsBandProps {
  maxGuests?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
}

interface StatItemProps {
  value: string;
  label: string;
}

function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="data text-2xl font-medium text-primary-700 sm:text-3xl">
        {value}
      </span>
      <span className="eyebrow text-[0.65rem] text-stone-500 sm:text-[0.7rem]">
        {label}
      </span>
    </div>
  );
}

export function StatsBand({
  maxGuests,
  bedrooms,
  bathrooms,
  surface,
}: StatsBandProps) {
  const t = useTranslations("statsband");

  const items: StatItemProps[] = [
    { value: maxGuests != null ? String(maxGuests) : "6", label: t("guests") },
    { value: bedrooms != null ? String(bedrooms) : "3", label: t("bedrooms") },
    ...(bathrooms != null
      ? [{ value: String(bathrooms), label: t("bathrooms") }]
      : []),
    ...(surface != null
      ? [{ value: `${surface} m²`, label: t("surface") }]
      : []),
    { value: "~38 km", label: t("distChambord") },
    { value: "~39 km", label: t("distGrandParquet") },
  ];

  return (
    <section
      aria-label={t("ariaLabel")}
      className="border-y border-sand-200 bg-sand-50 py-12"
    >
      <Container>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <div key={item.label} role="group" aria-label={item.label}>
              <StatItem value={item.value} label={item.label} />
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
