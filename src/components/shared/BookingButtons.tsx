import { getLocale, getTranslations } from "next-intl/server";
import { GuestFavourite } from "@/components/shared/GuestFavourite";
import { Button } from "@/components/ui/button";
import { formatRating, isGuestFavourite, platformName } from "@/lib/platforms";
import { cn } from "@/lib/utils";
import type { SiteSetting } from "@/payload-types";

interface BookingButtonsProps {
  settings: SiteSetting;
  compact?: boolean;
  className?: string;
}

export async function BookingButtons({
  settings,
  compact = false,
  className,
}: BookingButtonsProps) {
  const locale = await getLocale();
  const t = await getTranslations("common");

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {(settings.platforms ?? []).map((platform) => (
        <Button
          key={platform.id}
          asChild
          className={cn(
            compact ? "ui" : "plateforme",
            `plateforme-${platform.platform}`,
          )}
        >
          <a href={platform.url} target="_blank" rel="noopener">
            {compact
              ? platformName(platform)
              : t("booking.on", { platform: platformName(platform) })}
            {isGuestFavourite(platform.platform) && (
              <GuestFavourite
                label={t("booking.guestFavourite")}
                compact={compact}
              />
            )}
            {!compact && platform.rating && platform.reviewCount && (
              <small>
                {t("reviews.rating", {
                  rating: formatRating(platform.rating, locale),
                  scale: platform.ratingScale ?? 5,
                })}
                , {t("reviews.count", { count: platform.reviewCount })}
              </small>
            )}
            <span className="sr-only"> ({t("opensNewTab")})</span>
          </a>
        </Button>
      ))}
    </div>
  );
}
