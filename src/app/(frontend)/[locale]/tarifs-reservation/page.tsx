import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdditionalFees } from "@/components/rates/AdditionalFees";
import { Availability } from "@/components/rates/Availability";
import { BookingOptions } from "@/components/rates/BookingOptions";
import {
  type FinderPlatform,
  PriceFinder,
} from "@/components/rates/PriceFinder";
import { PriceTable } from "@/components/rates/PriceTable";
import { quoteOffersJsonLd } from "@/components/rates/quote-offers";
import { ratesFaq } from "@/components/rates/rates-faq";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Faq } from "@/components/shared/Faq";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { Reviews } from "@/components/shared/Reviews";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Seam } from "@/components/shared/Seam";
import { Sketch } from "@/components/shared/Sketch";
import { ForestScene, PondScene } from "@/components/shared/Tableaux";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getAvailability } from "@/lib/availability/load";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import {
  BOOKING_PLATFORM_NAMES,
  BOOKING_PLATFORMS,
  formatPrice,
  formatQuoteDate,
  pricedStays,
  referenceStay,
} from "@/lib/platforms";
import { getGlobal, getReviews } from "@/lib/queries";
import { reviewsLedBy } from "@/lib/review-topics";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";
import { cn } from "@/lib/utils";

interface RatesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: RatesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getGlobal("rates-page", locale);

  return pageMetadata({
    locale,
    href: "/tarifs-reservation",
    title: page.title,
    description: page.lede ?? "",
    meta: page.meta,
    share: await pageShareImage("rates", locale),
  });
}

const MINIMUM_STAY_TOKEN = "{sejour_minimum}";

export default async function RatesPage({ params }: RatesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, page, cottage, pricing, settings, reviews, availability] =
    await Promise.all([
      getTranslations("rates"),
      getTranslations("common"),
      getGlobal("rates-page", locale),
      getGlobal("cottage-page", locale),
      getGlobal("pricing-config", locale),
      getGlobal("site-settings", locale),
      getReviews(locale),
      getAvailability(),
    ]);

  const faqItems = await ratesFaq(pricing, settings, locale);
  const currency = pricing.currency || "EUR";
  const stays = pricedStays(pricing);
  const reference = referenceStay(stays);
  const finderPlatforms: FinderPlatform[] = BOOKING_PLATFORMS.flatMap(
    (platform) => {
      const listing = settings.platforms?.find(
        (item) => item.platform === platform,
      );

      return listing
        ? [
            {
              platform,
              name: BOOKING_PLATFORM_NAMES[platform],
              url: listing.url,
            },
          ]
        : [];
    },
  );
  const minimumStay = common("rates.nights", {
    count: pricing.minimumStay ?? 0,
  });
  const hasFees = (pricing.additionalFees ?? []).length > 0;
  const policies = pricing.policies;
  const times = [
    { label: common("facts.checkIn"), value: policies?.checkIn },
    { label: common("facts.checkOut"), value: policies?.checkOut },
  ].filter((time) => time.value);
  const conditions = [
    { title: t("cancellationTitle"), content: policies?.cancellation },
    { title: t("depositTitle"), content: policies?.deposit },
    { title: t("additionalTitle"), content: policies?.additional },
  ].filter((condition) => condition.content);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: common("nav.rates"), href: "/tarifs-reservation" },
          ]),
          quoteOffersJsonLd(pricing, locale),
          faqJsonLd(faqItems),
        ]}
      />

      <PageHero
        title={page.title}
        lede={page.lede}
        image={page.image ?? cottage.rooms?.[0]?.photos?.[0]?.image}
        crumbs={[{ label: common("nav.rates") }]}
      >
        {reference && (
          <p className="prix-phare">
            {t.rich("headline", {
              price: formatPrice(reference.nightly, currency, locale),
              guests: reference.guests,
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        )}
        <BookingButtons settings={settings} />
      </PageHero>

      {reference && (
        <section className="page section grid gap-y-10">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <h2 className="lg:col-span-6">{t("pricesTitle")}</h2>
            <div className="texte lg:col-span-6">
              <p className="chapeau">
                {pricing.quotedOn
                  ? t("keySentenceDated", {
                      price: formatPrice(reference.nightly, currency, locale),
                      guests: reference.guests,
                      date: formatQuoteDate(pricing.quotedOn, locale),
                    })
                  : t("keySentence", {
                      price: formatPrice(reference.nightly, currency, locale),
                      guests: reference.guests,
                    })}
              </p>
              {pricing.quotedOn && (
                <p className="discret">
                  {common("rates.quoted", {
                    date: formatQuoteDate(pricing.quotedOn, locale),
                  })}{" "}
                  {common("rates.exact")}
                </p>
              )}
            </div>
          </div>
          <PriceFinder
            stays={stays}
            platforms={finderPlatforms}
            currency={currency}
            defaultGuests={reference.guests}
          />
          <PriceTable pricing={pricing} />
        </section>
      )}

      {availability && (
        <Availability
          availability={availability}
          minimumStay={pricing.minimumStay ?? 1}
          settings={settings}
        />
      )}

      <Sketch kind="rive" />
      <section className="section section-courte section-claire">
        <div className="page grid gap-x-12 gap-y-14 lg:grid-cols-12">
          {hasFees && (
            <div className="grid content-start gap-8 lg:col-span-7">
              <h2>{t("feesTitle")}</h2>
              <AdditionalFees pricing={pricing} />
            </div>
          )}

          {times.length > 0 && (
            <div
              className={cn(
                "grid content-start gap-y-8",
                hasFees
                  ? "lg:col-span-5"
                  : "lg:col-span-12 lg:grid-cols-subgrid",
              )}
            >
              <h2 className={cn(!hasFees && "lg:col-span-5")}>
                {t("timesTitle")}
              </h2>
              <dl className={cn("horaires", !hasFees && "lg:col-span-7")}>
                {times.map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      <section className="section section-sombre crepuscule">
        <Seam kind="rive" />
        <PondScene heron />
        <div className="page grid gap-y-14">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
            <h2 className="lg:col-span-7">{page.stepsTitle}</h2>
            <RichTextRenderer
              content={page.directBooking}
              className="prose lg:col-span-5"
            />
          </div>
          <ol className="etapes">
            {(page.steps ?? []).map((step) => (
              <li key={step.id ?? step.title}>
                <h3>{step.title}</h3>
                <p>{step.text.replaceAll(MINIMUM_STAY_TOKEN, minimumStay)}</p>
              </li>
            ))}
          </ol>
          <h2>{t("booking.title")}</h2>
          <BookingOptions settings={settings} />
        </div>
      </section>

      {conditions.length > 0 && (
        <section className="page section section-courte grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <h2 className="lg:col-span-5">{t("conditionsTitle")}</h2>
          <div className="grid content-start gap-10 lg:col-span-7">
            {conditions.map(({ title, content }) => (
              <section key={title} className="condition">
                <h3>{title}</h3>
                <RichTextRenderer content={content} className="prose" />
              </section>
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="lisiere section section-sombre">
          <Seam kind="pins" />
          <ForestScene />
          <div className="page grid gap-10">
            <h2>{t("reviewsTitle")}</h2>
            <Reviews
              reviews={reviewsLedBy(reviews, "value")}
              settings={settings}
            />
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <>
          <section className="page section section-courte grid gap-10 lg:grid-cols-12">
            <h2 className="lg:col-span-5">{t("faqTitle")}</h2>
            <Faq items={faqItems} className="lg:col-span-7" />
          </section>
          <Sketch kind="brin" side="left" />
        </>
      )}

      <section className="appel section section-claire">
        <div className="page grid justify-items-start gap-6">
          <h2>{t("finalTitle")}</h2>
          <p className="chapeau">
            {t("finalText", {
              count: settings.propertyDetails?.maxGuests ?? 0,
            })}
          </p>
          <BookingButtons settings={settings} />
          <Link href="/contact" className="ui lien">
            {common("booking.direct")}
          </Link>
        </div>
      </section>
    </>
  );
}
