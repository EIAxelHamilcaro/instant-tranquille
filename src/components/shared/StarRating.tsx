"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export function StarRating({ rating }: { rating: number }) {
  const t = useTranslations("common");
  return (
    <div className="flex gap-0.5" aria-label={t("starRating", { rating })}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-earth-400 text-earth-400"
              : "fill-sand-200 text-sand-200"
          }`}
        />
      ))}
    </div>
  );
}
