"use client";

import {
  Bed,
  Home,
  Image as ImageIcon,
  type LucideIcon,
  MapPin,
  Trees,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  image: ImageIcon,
  home: Home,
  "map-pin": MapPin,
  utensils: Utensils,
  trees: Trees,
  bed: Bed,
};

export function ImagePlaceholder({
  aspectRatio = "16/9",
  icon = "image",
  label,
  className,
}: {
  aspectRatio?: string;
  icon?: string;
  label?: string;
  className?: string;
}) {
  const Icon = iconMap[icon] || ImageIcon;

  return (
    <div
      role="img"
      aria-label={label || "Image placeholder"}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-sand-300 bg-sand-100",
        className,
      )}
      style={{ aspectRatio }}
    >
      <Icon className="h-12 w-12 text-sand-600" aria-hidden="true" />
      {label && (
        <span className="mt-2 text-sm font-medium text-sand-700">{label}</span>
      )}
    </div>
  );
}
