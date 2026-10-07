import { getLocale, getTranslations } from "next-intl/server";
import { overallRating } from "@/lib/jsonld";
import { formatRating, platformName, ratedPlatforms } from "@/lib/platforms";
import type { SiteSetting, Testimonial } from "@/payload-types";

const LEAD_MAX_LENGTH = 220;

interface ReviewsProps {
  reviews: Testimonial[];
  settings: SiteSetting;
  limit?: number;
}

export async function Reviews({ reviews, settings, limit = 3 }: ReviewsProps) {
  const locale = await getLocale();
  const t = await getTranslations("common.reviews");
  const shown = reviews.slice(0, limit);
  const lead =
    shown.find((review) => review.text.length <= LEAD_MAX_LENGTH) ?? shown[0];
  if (!lead) return null;

  const others = shown.filter((review) => review !== lead);
  const overall = overallRating(settings);

  return (
    <div className="avis grid gap-x-16 gap-y-10 lg:grid-cols-12">
      <figure className="lg:col-span-7">
        <blockquote className="citation" lang={lead.language ?? undefined}>
          {lead.text}
        </blockquote>
        <figcaption className="ui">
          {lead.guestName}
          <ReviewSource source={lead.source} />
        </figcaption>
      </figure>

      <div className="grid content-start gap-8 lg:col-span-5">
        {others.map((review) => (
          <figure key={review.id}>
            <blockquote lang={review.language ?? undefined}>
              {review.text}
            </blockquote>
            <figcaption className="ui">
              {review.guestName}
              <ReviewSource source={review.source} />
            </figcaption>
          </figure>
        ))}
      </div>

      <ul className="avis-notes ui flex flex-wrap gap-x-10 gap-y-3 lg:col-span-12">
        {overall && (
          <li>
            <span className="trajet">
              {t("rating", {
                rating: formatRating(overall.ratingValue, locale),
                scale: overall.bestRating,
              })}
            </span>{" "}
            {t("overall", { count: overall.reviewCount })}
          </li>
        )}
        {ratedPlatforms(settings).map((platform) => (
          <li key={platform.id}>
            <a
              href={platform.url}
              className="lien"
              rel="noopener"
              target="_blank"
            >
              <span className="trajet">
                {t("rating", {
                  rating: formatRating(platform.rating ?? 0, locale),
                  scale: platform.ratingScale ?? 5,
                })}
              </span>{" "}
              {t("on", { platform: platformName(platform) })},{" "}
              {t("count", { count: platform.reviewCount ?? 0 })}
            </a>
            {platform.badge && (
              <span className="etiquette-distinction">{platform.badge}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOURCE_NAMES: Partial<Record<string, string>> = {
  airbnb: "Airbnb",
  booking: "Booking.com",
  google: "Google",
};

interface ReviewSourceProps {
  source: Testimonial["source"];
}

async function ReviewSource({ source }: ReviewSourceProps) {
  const t = await getTranslations("common.reviews");
  const platform = SOURCE_NAMES[source ?? ""];
  if (!platform) return null;

  return <span className="discret"> {t("on", { platform })}</span>;
}
