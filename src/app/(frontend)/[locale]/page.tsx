import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FilmDialog } from "@/components/home/FilmDialog";
import { HeroFilm } from "@/components/home/HeroFilm";
import { AutoScroll } from "@/components/shared/AutoScroll";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Faq } from "@/components/shared/Faq";
import { JsonLd } from "@/components/shared/JsonLd";
import { Photo } from "@/components/shared/Photo";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import { PriceSummary } from "@/components/shared/PriceSummary";
import { PropertyFacts } from "@/components/shared/PropertyFacts";
import { Reviews } from "@/components/shared/Reviews";
import { Sketch } from "@/components/shared/Sketch";
import { ForestScene, PondScene } from "@/components/shared/Tableaux";
import { Ticker } from "@/components/shared/Ticker";
import { FilterableRose } from "@/components/surroundings/FilterableRose";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import {
  cottageJsonLd,
  faqJsonLd,
  filmJsonLd,
  lexicalToText,
} from "@/lib/jsonld";
import { formatDrive } from "@/lib/places";
import {
  getAmenities,
  getGlobal,
  getPlaces,
  getReviews,
  populated,
  toRosePlace,
} from "@/lib/queries";
import { roseLabels } from "@/lib/rose-labels";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";
import { filmSources } from "@/lib/videos";
import type { Guide, Place } from "@/payload-types";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

const ROSE_MIN_MINUTES = 8;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getGlobal("home-page", locale);

  return pageMetadata({
    locale,
    href: "/",
    title: page.title,
    description: page.lede ?? "",
    meta: page.meta,
    share: await pageShareImage("home", locale),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [
    t,
    common,
    filmText,
    page,
    cottage,
    settings,
    pricing,
    places,
    reviews,
    amenities,
  ] = await Promise.all([
    getTranslations("home"),
    getTranslations("common"),
    getTranslations("film"),
    getGlobal("home-page", locale),
    getGlobal("cottage-page", locale),
    getGlobal("site-settings", locale),
    getGlobal("pricing-config", locale),
    getPlaces(locale),
    getReviews(locale),
    getAmenities(locale),
  ]);

  const origin = {
    lat: settings.contact?.coordinates?.lat ?? 0,
    lng: settings.contact?.coordinates?.lng ?? 0,
  };
  const featuredPlaces = places.filter((place) => place.featured);
  const guides = populated<Guide>(page.featuredGuides);
  const rooms = cottage.rooms ?? [];
  const [leadReview] = reviews;
  const film = filmSources(locale);
  const [headline, ...place] = page.title.split(", ");
  const faqItems = (settings.faqs ?? []).map((faq) => ({
    question: faq.question,
    answer: lexicalToText(faq.answer),
  }));

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
            cottage,
          }),
          faqJsonLd(faqItems),
          film &&
            filmJsonLd({
              film,
              name: filmText("schemaName"),
              description: filmText("schemaDescription"),
            }),
        ]}
      />

      <section className="hero section-sombre">
        <HeroFilm fallback={page.image} alt={t("heroImageAlt")} />
        <div className="page grid gap-8">
          <h1 className="hero-titre">
            {headline}
            {place.length > 0 && (
              <span className="hero-lieu">{place.join(", ")}</span>
            )}
          </h1>
          <p className="chapeau">{page.lede}</p>
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
        </div>
      </section>

      <Ticker
        items={featuredPlaces.map((item) => ({
          id: String(item.id),
          label: item.name,
          detail: formatDrive(item.driveMin),
        }))}
        label={t("tickerLabel")}
        pauseLabel={t("tickerPause")}
        playLabel={t("tickerPlay")}
      />

      <section className="page section-serree" aria-labelledby="titre-fiche">
        <h2 id="titre-fiche" className="sr-only">
          {t("factsTitle")}
        </h2>
        <PropertyFacts settings={settings} />
      </section>

      <section className="section grid gap-10">
        <div className="page grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <h2 className="lg:col-span-7">{page.houseTitle}</h2>
          <div className="grid content-start gap-5 lg:col-span-5">
            <p>{page.houseText}</p>
            <Link href="/le-gite" className="ui lien justify-self-start">
              {t("houseLink")}
            </Link>
          </div>
        </div>
        <PhotoViewer>
          <AutoScroll
            className="lueur"
            pauseLabel={t("tickerPause")}
            playLabel={t("tickerPlay")}
          >
            {rooms.map((room, index) => (
              <li
                key={room.id}
                className={index % 3 === 0 ? "large" : undefined}
              >
                <Photo
                  media={room.photos?.[0]?.image}
                  sizes={
                    index % 3 === 0
                      ? "(min-width: 1024px) 42vw, 21rem"
                      : "(min-width: 1024px) 28vw, 16rem"
                  }
                  ratio="aspect-auto"
                  zoom="photo"
                />
                <h3>{room.name}</h3>
                <p className="ui discret">{room.details}</p>
              </li>
            ))}
          </AutoScroll>
        </PhotoViewer>
      </section>

      <section className="section section-sombre crepuscule">
        <PondScene />
        <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <h2 className="lg:col-span-7">{page.surroundingsTitle}</h2>
          <p className="texte lg:col-span-5">{page.surroundingsText}</p>
          <figure className="lg:col-span-12">
            <FilterableRose
              origin={origin}
              places={places
                .filter((place) => place.driveMin >= ROSE_MIN_MINUTES)
                .map(toRosePlace)}
              labels={roseLabels(common)}
            />
            <figcaption className="legende">{t("roseCaption")}</figcaption>
          </figure>
          <PhotoViewer>
            <ul className="cartes cartes-quatre lg:col-span-12">
              {populated<Place>(page.featuredPlaces).map((featured) => (
                <li key={featured.id} className="carte">
                  <Photo
                    media={featured.image}
                    sizes="(min-width: 1024px) 22vw, (min-width: 704px) 45vw, 92vw"
                    ratio="aspect-3/2"
                    zoom="photo"
                  />
                  <h3>{featured.name}</h3>
                  <p className="trajet">
                    {formatDrive(featured.driveMin)}, {featured.driveKm} km
                  </p>
                  <p className="discret">{featured.summary}</p>
                </li>
              ))}
            </ul>
          </PhotoViewer>
          <Link
            href="/les-alentours"
            className="ui lien justify-self-start lg:col-span-12"
          >
            {t("surroundingsLink")}
          </Link>
        </div>
      </section>

      {leadReview && (
        <section className="lisiere section section-sombre">
          <ForestScene />
          <div className="page grid gap-10">
            <h2>{page.reviewsTitle}</h2>
            <Reviews reviews={reviews} settings={settings} />
          </div>
        </section>
      )}

      <Sketch kind="vol" above />
      <section className="page section grid gap-x-12 gap-y-10 lg:grid-cols-12">
        <h2 className="lg:col-span-7">{page.guidesTitle}</h2>
        <div className="grid content-start gap-5 lg:col-span-5">
          <p className="texte">{page.guidesText}</p>
          <Link href="/guides" className="ui lien justify-self-start">
            {t("guidesLink")}
          </Link>
        </div>
        <PhotoViewer>
          <ul className="cartes lg:col-span-12">
            {guides.map((guide) => (
              <li key={guide.id} className="carte">
                <Photo
                  media={guide.image}
                  sizes="(min-width: 68rem) 30vw, (min-width: 704px) 45vw, 92vw"
                  ratio="aspect-3/2"
                  zoom="loupe"
                />
                <span className="etiquette">
                  {common(`categories.${guide.theme}`)}
                </span>
                <h3>
                  <Link
                    href={{
                      pathname: "/guides/[slug]",
                      params: { slug: guide.slug },
                    }}
                  >
                    {guide.title}
                  </Link>
                </h3>
                <p className="discret">{guide.excerpt}</p>
              </li>
            ))}
          </ul>
        </PhotoViewer>
      </section>

      <section className="appel section section-claire">
        <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-5">
            <h2>{page.bookingTitle}</h2>
            <p className="texte">{page.bookingText}</p>
            <BookingButtons settings={settings} />
            <Link
              href="/tarifs-reservation"
              className="ui lien justify-self-start"
            >
              {t("ratesLink")}
            </Link>
          </div>
          <div className="lg:col-span-7">
            <PriceSummary pricing={pricing} />
          </div>
        </div>
      </section>

      {faqItems.length > 0 && (
        <section className="page section section-courte grid gap-10 lg:grid-cols-12">
          <h2 className="lg:col-span-5">{t("faqTitle")}</h2>
          <Faq items={faqItems} className="lg:col-span-7" />
        </section>
      )}
    </>
  );
}
