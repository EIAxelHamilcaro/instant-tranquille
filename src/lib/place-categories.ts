import type { PlaceCategory } from "@/lib/places";

interface CategoryOption {
  label: string;
  value: PlaceCategory;
}

export const PLACE_CATEGORY_OPTIONS: CategoryOption[] = [
  { label: "Châteaux de la Loire", value: "chateaux" },
  { label: "Cheval et sports équestres", value: "equestre" },
  { label: "Sorties en famille", value: "famille" },
  { label: "Nature et étangs", value: "nature" },
  { label: "Villes et villages", value: "villages" },
  { label: "Vins et terroir", value: "terroir" },
  { label: "Sur la Loire et le Cher (bateaux, canoë)", value: "loire" },
  { label: "À Romorantin", value: "romorantin" },
  { label: "Pratique (gare, commerces)", value: "pratique" },
];

export const GUIDE_THEME_OPTIONS = PLACE_CATEGORY_OPTIONS.filter(
  (option) => option.value !== "pratique",
);
