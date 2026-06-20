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
    <div className="flex flex-col items-center gap-1 px-6 py-2 text-center">
      <span className="font-sans text-3xl font-bold tracking-tight text-primary-700 sm:text-4xl">
        {value}
      </span>
      <span className="font-serif text-sm tracking-wide text-stone-500 uppercase">
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
    {
      value: maxGuests != null ? String(maxGuests) : "6",
      label: t("guests"),
    },
    {
      value: bedrooms != null ? String(bedrooms) : "3",
      label: t("bedrooms"),
    },
    ...(bathrooms != null
      ? [{ value: String(bathrooms), label: t("bathrooms") }]
      : []),
    ...(surface != null
      ? [{ value: `${surface} m²`, label: t("surface") }]
      : []),
    {
      value: "~12 km",
      label: t("distChambord"),
    },
    {
      value: "~17 km",
      label: t("distGrandParquet"),
    },
  ];

  return (
    <section
      aria-label={t("ariaLabel")}
      className="border-y border-sand-200 bg-sand-50 py-10"
    >
      <Container>
        <dl className="flex flex-wrap items-center justify-center gap-y-6 divide-x divide-sand-200">
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
