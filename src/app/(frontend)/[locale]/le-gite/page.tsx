import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AmenityGroups } from "@/components/cottage/AmenityGroups";
import { KeyFacts } from "@/components/cottage/KeyFacts";
import { PhotoBoard } from "@/components/cottage/PhotoBoard";
import { RoomTour } from "@/components/cottage/RoomTour";
import { FilmDialog } from "@/components/home/FilmDialog";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { Reviews } from "@/components/shared/Reviews";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { Sketch } from "@/components/shared/Sketch";
import { ForestScene, PondScene } from "@/components/shared/Tableaux";
import { mediaOf } from "@/components/shared/viewer-photos";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, cottageJsonLd, filmJsonLd } from "@/lib/jsonld";
import { formatPrice, nightlyRange, pricedStays } from "@/lib/platforms";
import { getAmenities, getGlobal, getReviews } from "@/lib/queries";
import { reviewsAbout } from "@/lib/review-topics";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";
import { filmSources } from "@/lib/videos";

interface CottagePageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: CottagePageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getGlobal("cottage-page", locale);

  return pageMetadata({
    locale,
    href: "/le-gite",
    title: page.title,
    description: page.lede ?? "",
    meta: page.meta,
    share: await pageShareImage("cottage", locale),
  });
}

export default async function CottagePage({ params }: CottagePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, filmText, page, settings, pricing, amenities, reviews] =
    await Promise.all([
      getTranslations("cottage"),
      getTranslations("common"),
      getTranslations("film"),
      getGlobal("cottage-page", locale),
      getGlobal("site-settings", locale),
      getGlobal("pricing-config", locale),
      getAmenities(locale),
      getReviews(locale),
    ]);

  const rooms = page.rooms ?? [];
  const gallery = mediaOf(page.gallery);
  const houseReviews = reviewsAbout(reviews, "house");
  const film = filmSources(locale);
  const lowestNightly = nightlyRange(pricedStays(pricing))?.min;

  return (
    <>
      <JsonLd
        data={[
          cottageJsonLd({
            locale,
            settings,
            pricing,
            amenities,
            reviews,
            cottage: page,
          }),
          breadcrumbJsonLd(locale, [
            { name: common("nav.cottage"), href: "/le-gite" },
          ]),
          film &&
            filmJsonLd({
              film,
              name: filmText("schemaName"),
              description: filmText("schemaDescription"),
            }),
        ]}
      />

      <PageHero
        title={page.title}
        lede={page.lede}
        image={page.image ?? rooms[0]?.photos?.[0]?.image}
        crumbs={[{ label: common("nav.cottage") }]}
      >
        <BookingButtons settings={settings} />
        {film && (
          <FilmDialog
            sources={film}
            label={t("filmButton")}
            title={t("filmTitle")}
            endTitle={settings.filmEndTitle ?? ""}
          >
            <BookingButtons settings={settings} />
          </FilmDialog>
        )}
      </PageHero>

      <section
        className="page section-serree grid gap-y-12"
        aria-labelledby="titre-fiche"
      >
        <h2 id="titre-fiche" className="sr-only">
          {t("factsTitle")}
        </h2>
        <KeyFacts settings={settings} />
        <RichTextRenderer content={page.description} className="presentation" />
      </section>
      <Sketch kind="vol" />

      <RoomTour rooms={rooms} />

      {amenities.length > 0 && (
        <section className="section section-sombre crepuscule">
          <PondScene heron />
          <div className="page grid gap-y-10">
            <h2>{t("amenitiesTitle")}</h2>
            <AmenityGroups amenities={amenities} />
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="page section grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <h2 className="lg:col-span-5">{t("galleryTitle")}</h2>
          <PhotoViewer>
            <PhotoBoard
              photos={gallery}
              layout="mosaique"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="lg:col-span-7"
            />
          </PhotoViewer>
        </section>
      )}

      {houseReviews.length > 0 && (
        <section className="lisiere section section-sombre">
          <ForestScene />
          <div className="page grid gap-10">
            <h2>{t("reviewsTitle")}</h2>
            <Reviews reviews={houseReviews} settings={settings} limit={4} />
          </div>
        </section>
      )}

      <section className="appel section section-claire">
        <div className="page grid justify-items-start gap-6">
          <h2>{t("bookingTitle")}</h2>
          {lowestNightly && (
            <p className="chapeau">
              {common("booking.from", {
                price: formatPrice(
                  lowestNightly,
                  pricing.currency || "EUR",
                  locale,
                ),
              })}
              {t("bookingText", {
                count: settings.propertyDetails?.maxGuests ?? 0,
              })}
            </p>
          )}
          <BookingButtons settings={settings} />
          <Link href="/tarifs-reservation" className="ui lien">
            {t("bookingLink")}
          </Link>
        </div>
      </section>
    </>
  );
}
