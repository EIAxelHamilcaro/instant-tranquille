import { getTranslations } from "next-intl/server";
import { amenityIcon } from "@/lib/amenity-icons";
import type { Amenity } from "@/payload-types";

const CATEGORY_ORDER: Amenity["category"][] = [
  "indoor",
  "kitchen",
  "bedroom",
  "bathroom",
  "comfort",
  "tech",
  "outdoor",
];

interface AmenityGroupsProps {
  amenities: Amenity[];
  className?: string;
}

export async function AmenityGroups({
  amenities,
  className,
}: AmenityGroupsProps) {
  const t = await getTranslations("cottage.categories");
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: amenities.filter((amenity) => amenity.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className={className}>
      {groups.map(({ category, items }) => (
        <section key={category} className="rayon">
          <h3>{t(category)}</h3>
          <ul className="equipements">
            {items.map((amenity) => {
              const Icon = amenityIcon(amenity.icon);

              return (
                <li key={amenity.id}>
                  <Icon aria-hidden="true" />
                  {amenity.name}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
