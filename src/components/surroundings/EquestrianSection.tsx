import { ExternalLink, Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface EquestrianVenue {
  name?: string | null;
  description?: string | null;
  distanceFromGite?: string | null;
  website?: string | null;
}

interface EquestrianSectionProps {
  venues?: EquestrianVenue[] | null;
  sectionTitle?: string | null;
}

export function EquestrianSection({
  venues,
  sectionTitle,
}: EquestrianSectionProps) {
  const t = useTranslations("equestrian");

  const faqItems: Array<{ q: string; a: string }> = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];

  return (
    <section className="bg-primary-50 py-20">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={sectionTitle ?? t("sectionTitle")}
          subtitle={t("intro")}
          variant="left"
          centered={false}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          {/* Grand Parquet highlight */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
              <div className="relative aspect-[16/9] overflow-hidden bg-primary-100">
                <ImagePlaceholder
                  aspectRatio="16/9"
                  icon="trees"
                  label={t("placeholderLabel")}
                  className="h-full w-full rounded-none border-0 bg-primary-100"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {t("grandParquetTitle")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t("grandParquetText")}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-primary-600">
                  <Navigation className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>~17 km — 20 min</span>
                </div>
              </div>
            </div>

            {/* Other venues from CMS */}
            {venues && venues.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  {t("venuesTitle")}
                </h3>
                <ul className="space-y-3">
                  {venues.map((venue, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-sand-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          {venue.name && (
                            <p className="font-semibold text-foreground">
                              {venue.name}
                            </p>
                          )}
                          {venue.description && (
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {venue.description}
                            </p>
                          )}
                          {venue.distanceFromGite && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-primary-600">
                              <Navigation
                                className="h-3 w-3 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{venue.distanceFromGite}</span>
                            </div>
                          )}
                        </div>
                        {venue.website && (
                          <a
                            href={venue.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={t("websiteLabel")}
                            className="shrink-0 text-primary-600 transition-colors hover:text-primary-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* FAQ équestre */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              {t("faqTitle")}
            </h3>
            <dl className="space-y-5">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm"
                >
                  <dt className="font-semibold text-foreground">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
