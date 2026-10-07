import {
  Baby,
  Bath,
  BedDouble,
  Bike,
  Car,
  Coffee,
  CookingPot,
  Dice5,
  Fence,
  Flame,
  type LucideIcon,
  PawPrint,
  Refrigerator,
  Shirt,
  Sofa,
  Thermometer,
  Trees,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
} from "lucide-react";

const AMENITY_ICONS = {
  wifi: { label: "Wifi", icon: Wifi },
  parking: { label: "Stationnement", icon: Car },
  kitchen: { label: "Cuisine", icon: CookingPot },
  dishes: { label: "Vaisselle, lave-vaisselle", icon: Utensils },
  fridge: { label: "Réfrigérateur", icon: Refrigerator },
  coffee: { label: "Café", icon: Coffee },
  barbecue: { label: "Barbecue, cheminée", icon: Flame },
  garden: { label: "Jardin", icon: Trees },
  fence: { label: "Terrain clos", icon: Fence },
  living: { label: "Salon", icon: Sofa },
  tv: { label: "Télévision", icon: Tv },
  games: { label: "Jeux", icon: Dice5 },
  bed: { label: "Literie", icon: BedDouble },
  linen: { label: "Linge", icon: Shirt },
  bath: { label: "Salle de bain", icon: Bath },
  laundry: { label: "Lave-linge", icon: WashingMachine },
  heating: { label: "Chauffage", icon: Thermometer },
  baby: { label: "Bébé", icon: Baby },
  pets: { label: "Animaux", icon: PawPrint },
  bike: { label: "Vélos", icon: Bike },
} satisfies Record<string, { label: string; icon: LucideIcon }>;

export type AmenityIconName = keyof typeof AMENITY_ICONS;

export const AMENITY_ICON_OPTIONS = Object.entries(AMENITY_ICONS).map(
  ([value, { label }]) => ({ label, value }),
);

export function amenityIcon(name: string | null | undefined): LucideIcon {
  return AMENITY_ICONS[name as AmenityIconName]?.icon ?? Sofa;
}
