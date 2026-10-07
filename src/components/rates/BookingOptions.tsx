import { getLocale, getTranslations } from "next-intl/server";
import { GuestFavourite } from "@/components/shared/GuestFavourite";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  formatRating,
  isDistinguished,
  platformName,
  ratedPlatforms,
} from "@/lib/platforms";
import type { SiteSetting } from "@/payload-types";

interface BookingOptionsProps {
  settings: SiteSetting;
}

export async function BookingOptions({ settings }: BookingOptionsProps) {
  const locale = await getLocale();
  const t = await getTranslations("rates.booking");
  const common = await getTranslations("common");
  const { email, phone } = settings.contact ?? {};

  return (
    <ul className="voies">
      {ratedPlatforms(settings).map((platform) => (
        <li key={platform.id ?? platform.url}>
          <h3>{platformName(platform)}</h3>
          {isDistinguished(platform.platform) && (
            <GuestFavourite label={common("booking.guestFavourite")} />
          )}
          <p className="note">
            {common("reviews.rating", {
              rating: formatRating(platform.rating ?? 0, locale),
              scale: platform.ratingScale ?? 5,
            })}
          </p>
          <p>
            {t("reviewsBy", {
              count: platform.reviewCount ?? 0,
              platform: platformName(platform),
            })}
            {isDistinguished(platform.platform) &&
              `, ${common("booking.superhost")}`}
          </p>
          <Button
            asChild
            size="lg"
            className={`plateforme-${platform.platform}`}
          >
            <a href={platform.url} rel="noopener" target="_blank">
              {common("booking.on", { platform: platformName(platform) })}
              <span className="sr-only"> ({common("opensNewTab")})</span>
            </a>
          </Button>
        </li>
      ))}

      <li>
        <h3>{t("directTitle")}</h3>
        {settings.hosts && <p className="note">{settings.hosts}</p>}
        <p>{t("directChannels")}</p>
        <Button asChild size="lg">
          <Link href="/contact">{common("booking.direct")}</Link>
        </Button>
        {email && (
          <a href={`mailto:${email}`} className="ui lien">
            {t("emailLink", { email })}
          </a>
        )}
        {phone && (
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="ui lien">
            {t("phoneLink", { phone })}
          </a>
        )}
      </li>
    </ul>
  );
}
