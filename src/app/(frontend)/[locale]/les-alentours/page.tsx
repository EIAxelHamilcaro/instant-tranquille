import { RichText } from "@payloadcms/richtext-lexical/react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { Seam } from "@/components/shared/Seam";
import { Sketch } from "@/components/shared/Sketch";
import { PondScene } from "@/components/shared/Tableaux";
import { Ticker } from "@/components/shared/Ticker";
import { CategoryBar } from "@/components/surroundings/CategoryBar";
import { FilterableRose } from "@/components/surroundings/FilterableRose";
import { GuideCards } from "@/components/surroundings/GuideCards";
import { OfficialLinks } from "@/components/surroundings/OfficialLinks";
import { PlaceCards } from "@/components/surroundings/PlaceCards";
import { PlaceList } from "@/components/surroundings/PlaceList";
import { StayCall } from "@/components/surroundings/StayCall";
import { SurroundingsMap } from "@/components/surroundings/SurroundingsMap";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, placesJsonLd } from "@/lib/jsonld";
import { OFFICIAL_SITE_GROUPS, toOfficialLink } from "@/lib/official-sites";
import { formatDrive, PLACE_CATEGORIES } from "@/lib/places";
import {
  getGlobal,
  getGuides,
  getOfficialSites,
  getPlaces,
  toRosePlace,
} from "@/lib/queries";
import { roseLabels } from "@/lib/rose-labels";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";
import type { Place } from "@/payload-types";

const ROSE_MIN_MINUTES = 8;
const GUIDE_CARDS = 3;

interface SurroundingsPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: SurroundingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getGlobal("surroundings-page", locale);

  return pageMetadata({
    locale,
    href: "/les-alentours",
    title: page.title,
    description: page.lede ?? "",
    meta: page.meta,
    share: await pageShareImage("surroundings", locale),
  });
}

function driveRange(places: Place[]) {
  const minutes = places.map((place) => place.driveMin);

  return {
    count: places.length,
    min: formatDrive(Math.min(...minutes)),
    max: formatDrive(Math.max(...minutes)),
  };
}

export default async function SurroundingsPage({
  params,
}: SurroundingsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, page, settings, places, guides, sites] = await Promise.all([
    getTranslations("surroundings"),
    getTranslations("common"),
    getGlobal("surroundings-page", locale),
    getGlobal("site-settings", locale),
    getPlaces(locale),
    getGuides(locale),
    getOfficialSites(locale),
  ]);

  const origin = {
    lat: settings.contact?.coordinates?.lat ?? 0,
    lng: settings.contact?.coordinates?.lng ?? 0,
  };
  const rosePlaces = places.filter(
    (place) => place.driveMin >= ROSE_MIN_MINUTES,
  );
  const featuredPlaces = places.filter((place) => place.featured);
  const riderPlaces = places.filter((place) => place.category === "equestre");
  const riderGuides = guides.filter((guide) => guide.theme === "equestre");
  const riderEvents = riderPlaces.flatMap((place) =>
    (place.events ?? []).map((event) => ({ ...event, place })),
  );
  const practicalPlaces = places.filter(
    (place) => place.category === "pratique",
  );
  const groups = PLACE_CATEGORIES.filter(
    (category) => category !== "equestre" && category !== "pratique",
  )
    .map((category) => ({
      category,
      places: places.filter((place) => place.category === category),
    }))
    .filter((group) => group.places.length > 0);
  const siteGroups = OFFICIAL_SITE_GROUPS.map((group) => ({
    group,
    links: sites.filter((site) => site.group === group).map(toOfficialLink),
  })).filter(({ links }) => links.length > 0);
  const showRiders = riderPlaces.length > 0 || Boolean(page.equestrianText);
  const guideCards = [
    ...guides.filter((guide) => guide.theme !== "equestre"),
    ...riderGuides,
  ]
    .filter(
      (guide, index, list) =>
        list.findIndex((other) => other.theme === guide.theme) === index,
    )
    .slice(0, GUIDE_CARDS);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: common("nav.surroundings"), href: "/les-alentours" },
          ]),
          places.length > 0 ? placesJsonLd(page.title, places) : null,
        ]}
      />

      <PageHero
        title={page.title}
        lede={page.lede}
        image={page.image}
        crumbs={[{ label: common("nav.surroundings") }]}
      >
        <nav aria-label={t("categoriesNav")}>
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ category, places: categoryPlaces }) => (
              <li key={category}>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className={`pastille pastille-ronde categorie-${category}`}
                >
                  <a href={`#categorie-${category}`}>
                    {common(`categories.${category}`)}
                    <span className="compte">{categoryPlaces.length}</span>
                    <span className="sr-only">
                      {t("placesUnit", { count: categoryPlaces.length })}
                    </span>
                  </a>
                </Button>
              </li>
            ))}
            {showRiders && (
              <li>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="pastille pastille-ronde categorie-equestre"
                >
                  <a href="#categorie-equestre">
                    {common("categories.equestre")}
                  </a>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </PageHero>

      {featuredPlaces.length > 0 && (
        <Ticker
          label={t("tickerLabel")}
          pauseLabel={t("tickerPause")}
          playLabel={t("tickerPlay")}
          items={featuredPlaces.map((place) => ({
            id: String(place.id),
            label: place.name,
            detail: formatDrive(place.driveMin),
          }))}
        />
      )}

      {rosePlaces.length > 0 && (
        <section className="section section-claire">
          <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <h2 className="lg:col-span-5">{t("roseTitle")}</h2>
            <div className="grid content-start gap-6 lg:col-span-7">
              {page.intro && <RichText data={page.intro} className="prose" />}
              <p className="ui discret">{t("roseText")}</p>
            </div>
            <figure className="lg:col-span-12">
              <FilterableRose
                origin={origin}
                places={rosePlaces.map(toRosePlace)}
                labels={roseLabels(common)}
              />
              <figcaption className="legende">{t("roseCaption")}</figcaption>
            </figure>
          </div>
        </section>
      )}

      <CategoryBar
        label={t("placesNav")}
        stops={[
          ...groups.map(({ category, places: categoryPlaces }) => ({
            category,
            label: common(`categories.${category}`),
            count: categoryPlaces.length,
          })),
          ...(showRiders
            ? [
                {
                  category: "equestre" as const,
                  label: common("categories.equestre"),
                },
              ]
            : []),
        ]}
      />

      {groups.map(({ category, places: categoryPlaces }) => (
        <section
          key={category}
          id={`categorie-${category}`}
          className="page section-serree ancre grid gap-10"
          aria-labelledby={`titre-${category}`}
        >
          <header className="entete-categorie">
            <h2
              id={`titre-${category}`}
              className={`titre-categorie categorie-${category}`}
            >
              {page.headings?.[category]}
            </h2>
            <p className="ui discret">
              {t("categoryRange", driveRange(categoryPlaces))}
            </p>
          </header>
          <PlaceCards places={categoryPlaces} />
        </section>
      ))}

      {showRiders && (
        <section
          id="categorie-equestre"
          className="section section-sombre crepuscule ancre"
        >
          <Seam kind="rive" />
          <PondScene heron />
          <div className="page grid gap-x-12 gap-y-12 lg:grid-cols-12">
            <div className="grid content-start gap-6 lg:col-span-5">
              <h2>{page.equestrianTitle || common("categories.equestre")}</h2>
              {page.equestrianText && (
                <RichText data={page.equestrianText} className="prose" />
              )}
              {riderGuides.length > 0 && (
                <ul className="ui grid gap-3" aria-label={t("riderGuides")}>
                  {riderGuides.map((guide) => (
                    <li key={guide.id}>
                      <Link
                        href={{
                          pathname: "/guides/[slug]",
                          params: { slug: guide.slug },
                        }}
                        className="lien"
                      >
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {riderPlaces.length > 0 && (
              <PlaceCards
                places={riderPlaces}
                showEvents={false}
                uniform
                className="lg:col-span-7"
              />
            )}
            {riderEvents.length > 0 && (
              <div className="grid gap-6 lg:col-span-12">
                <h3>{t("calendarTitle")}</h3>
                <ol className="calendrier">
                  {riderEvents.map((event) => (
                    <li key={event.id ?? event.name}>
                      {event.period && (
                        <span className="periode">{event.period}</span>
                      )}
                      <strong>{event.name}</strong>
                      <span className="ui discret">
                        {t("calendarAt", {
                          place: event.place.name,
                          drive: formatDrive(event.place.driveMin),
                        })}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </section>
      )}

      {places.length > 0 && (
        <section className="page section grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <h2 className="lg:col-span-5">{t("mapTitle")}</h2>
          <p className="texte discret lg:col-span-7">{t("mapText")}</p>
          <SurroundingsMap
            className="lg:col-span-12"
            origin={origin}
            originLabel={common("siteName")}
            label={t("mapLabel")}
            places={places.map((place) => ({
              id: String(place.id),
              name: place.name,
              category: place.category,
              lat: place.lat,
              lng: place.lng,
              drive: `${formatDrive(place.driveMin)}, ${common("drive.km", { km: place.driveKm })}`,
            }))}
          />
          {practicalPlaces.length > 0 && (
            <div className="grid gap-6 lg:col-span-12 lg:grid-cols-12 lg:gap-x-12">
              <h2 className="titre-categorie categorie-pratique lg:col-span-5">
                {page.headings?.pratique}
              </h2>
              <PlaceList places={practicalPlaces} className="lg:col-span-7" />
            </div>
          )}
        </section>
      )}

      <Sketch kind="rive" />
      <section className="section section-claire">
        <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-4">
            <h2>{t("officialTitle")}</h2>
            <p className="texte discret">{t("officialText")}</p>
          </div>
          <div className="grid content-start gap-12 lg:col-span-8">
            {siteGroups.map(({ group, links }) => (
              <div key={group} className="grid gap-4">
                <h3>{t(`officialGroups.${group}`)}</h3>
                <OfficialLinks links={links} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {guideCards.length > 0 && (
        <section className="page section grid gap-10">
          <header className="entete-categorie">
            <h2>{t("guidesTitle")}</h2>
            <Link href="/guides" className="ui lien">
              {t("guidesLink", { count: guides.length })}
            </Link>
          </header>
          <GuideCards guides={guideCards} />
        </section>
      )}

      {places.length > 0 && (
        <StayCall
          settings={settings}
          text={t("stay.text", {
            count: settings.propertyDetails?.maxGuests ?? 0,
            max: driveRange(places).max,
          })}
        />
      )}
    </>
  );
}
