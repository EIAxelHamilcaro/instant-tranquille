import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/shared/Faq";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { Seam } from "@/components/shared/Seam";
import { ForestScene, PondScene } from "@/components/shared/Tableaux";
import { DriveTimeRose } from "@/components/surroundings/DriveTimeRose";
import { GuideBody } from "@/components/surroundings/GuideBody";
import { GuideBrief } from "@/components/surroundings/GuideBrief";
import { GuideCards } from "@/components/surroundings/GuideCards";
import { GuideDrives } from "@/components/surroundings/GuideDrives";
import {
  guideHeadings,
  guideProgramme,
  guideWordCount,
  readingMinutes,
} from "@/components/surroundings/guide-content";
import { OfficialLinks } from "@/components/surroundings/OfficialLinks";
import { PlaceCards } from "@/components/surroundings/PlaceCards";
import { StayCall } from "@/components/surroundings/StayCall";
import { type Locale, locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { followRedirect } from "@/lib/follow-redirect";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  guideJsonLd,
  guideTripJsonLd,
} from "@/lib/jsonld";
import { toOfficialLink } from "@/lib/official-sites";
import {
  getGlobal,
  getGuideBySlug,
  getGuides,
  getPublishedGuideSlugs,
  populated,
  toRosePlace,
} from "@/lib/queries";
import { roseLabels } from "@/lib/rose-labels";
import { pageMetadata } from "@/lib/seo";
import { guideShareImage } from "@/lib/share-image/content";
import { cn } from "@/lib/utils";
import type { OfficialSite, Place } from "@/payload-types";

const RELATED_GUIDES = 3;
const FOREST_GUIDES = new Set(["brame-du-cerf-en-sologne"]);

interface GuidePageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedGuideSlugs();

  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = await getGuideBySlug(slug, locale);
  if (!guide) return {};

  const t = await getTranslations({ locale, namespace: "guides" });

  return pageMetadata({
    locale,
    href: { pathname: "/guides/[slug]", params: { slug } },
    title: t("articleMetaTitle", { title: guide.title }),
    description: guide.excerpt,
    meta: guide.meta,
    share: await guideShareImage(guide, locale),
    type: "article",
    publishedTime: guide.createdAt,
    modifiedTime: guide.updatedAt,
  });
}

function officialLinks(places: Place[]) {
  const namesByUrl = new Map<string, string[]>();

  for (const place of places) {
    if (!place.website) continue;

    namesByUrl.set(place.website, [
      ...(namesByUrl.get(place.website) ?? []),
      place.name,
    ]);
  }

  return [...namesByUrl].map(([url, names]) => ({
    url,
    name: names.join(", "),
  }));
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = await getGuideBySlug(slug, locale);
  if (!guide) {
    await followRedirect(`/guides/${slug}`, locale);
    notFound();
  }

  const inForest = FOREST_GUIDES.has(slug);

  const [t, common, guidesPage, settings, guides] = await Promise.all([
    getTranslations("guides"),
    getTranslations("common"),
    getGlobal("guides-page", locale),
    getGlobal("site-settings", locale),
    getGuides(locale),
  ]);

  const origin = {
    lat: settings.contact?.coordinates?.lat ?? 0,
    lng: settings.contact?.coordinates?.lng ?? 0,
  };
  const places = populated<Place>(guide.places).sort(
    (a, b) => a.driveMin - b.driveMin,
  );
  const practical = guide.practical ?? [];
  const sourceLinks = (guide.sources ?? []).map(({ name, url }) => ({
    name,
    url,
  }));
  const placeLinks = officialLinks(places).filter((link) =>
    sourceLinks.every((source) => source.url !== link.url),
  );
  const tourismLinks = populated<OfficialSite>(
    guidesPage.themeSites?.[guide.theme],
  )
    .map(toOfficialLink)
    .filter((link) =>
      [...sourceLinks, ...placeLinks].every((other) => other.url !== link.url),
    );
  const links = [...sourceLinks, ...placeLinks, ...tourismLinks];
  const headings = guideHeadings(guide.body);
  const faqItems = (guide.faq ?? []).map(({ question, answer }) => ({
    question,
    answer,
  }));
  const others = guides.filter((other) => other.id !== guide.id);
  const related = [
    ...others.filter((other) => other.theme === guide.theme),
    ...others.filter((other) => other.theme !== guide.theme),
  ].slice(0, RELATED_GUIDES);
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(guide.updatedAt),
  );
  const checked =
    guide.checkedAt &&
    new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
      new Date(guide.checkedAt),
    );

  return (
    <article>
      <JsonLd
        data={[
          guideJsonLd(guide, places, locale, guideWordCount(guide.body)),
          breadcrumbJsonLd(locale, [
            { name: common("nav.guides"), href: "/guides" },
            {
              name: guide.title,
              href: { pathname: "/guides/[slug]", params: { slug } },
            },
          ]),
          faqJsonLd(faqItems),
          guideTripJsonLd(guide, guideProgramme(guide.body), locale),
        ]}
      />

      <PageHero
        title={guide.title}
        lede={guide.excerpt}
        image={guide.image}
        crumbs={[
          { label: common("nav.guides"), href: "/guides" },
          { label: guide.title },
        ]}
      >
        <p className="ui flex flex-wrap gap-x-6 gap-y-1">
          <span>{common(`categories.${guide.theme}`)}</span>
          <span>{t("readTime", { minutes: readingMinutes(guide.body) })}</span>
          <span>
            {t.rich("updated", {
              date: () => <time dateTime={guide.updatedAt}>{updated}</time>,
            })}
          </span>
        </p>
      </PageHero>

      <div className="page section-serree lecture grid gap-x-12 gap-y-10 lg:grid-cols-12">
        {headings.length > 0 && (
          <div className="marge-guide lg:col-span-4">
            <nav className="sommaire" aria-label={t("tocLabel")}>
              <h2>{t("tocTitle")}</h2>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <GuideDrives places={places} />
          </div>
        )}
        <div className="corps-guide grid content-start gap-10 lg:col-span-8">
          {practical.length > 0 && (
            <section className="en-bref" aria-labelledby="en-bref">
              <h2 id="en-bref">{t("practicalTitle")}</h2>
              <GuideBrief items={practical} />
              {checked && (
                <p className="ui discret">{t("checked", { date: checked })}</p>
              )}
            </section>
          )}
          <GuideBody body={guide.body} places={places} className="prose" />
        </div>
      </div>

      {places.length > 0 && (
        <section
          className={cn(
            "section section-sombre",
            inForest ? "lisiere" : "crepuscule",
          )}
        >
          <Seam kind={inForest ? "pins" : "rive"} />
          {inForest ? <ForestScene stag="brame" /> : <PondScene />}
          <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <div className="grid content-start gap-6 lg:col-span-5">
              <h2>{t("placesTitle")}</h2>
              <figure className="rose-collante">
                <DriveTimeRose
                  origin={origin}
                  places={places.map(toRosePlace)}
                  labels={roseLabels(common)}
                />
                <figcaption className="legende">{t("roseCaption")}</figcaption>
              </figure>
            </div>
            <PlaceCards places={places} uniform className="lg:col-span-7" />
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="page section grid gap-10 lg:grid-cols-12">
          <h2 className="lg:col-span-5">{t("faqTitle")}</h2>
          <Faq items={faqItems} className="lg:col-span-7" />
        </section>
      )}

      {links.length > 0 && (
        <section className="section-serree section-claire">
          <div className="page grid gap-x-12 gap-y-8 lg:grid-cols-12">
            <div className="grid content-start gap-6 lg:col-span-4">
              <h2>{t("officialTitle")}</h2>
              <p className="texte discret">
                {checked
                  ? t("officialChecked", { date: checked })
                  : t("officialText")}
              </p>
              <Link
                href="/les-alentours"
                className="ui lien justify-self-start"
              >
                {t("allPlaces")}
              </Link>
            </div>
            <OfficialLinks links={links} className="lg:col-span-8" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="page section grid gap-10">
          <header className="entete-categorie">
            <h2>{t("moreTitle")}</h2>
            <Link href="/guides" className="ui lien">
              {t("allGuides")}
            </Link>
          </header>
          <GuideCards guides={related} />
        </section>
      )}

      <StayCall
        settings={settings}
        text={t("stayText", {
          count: settings.propertyDetails?.maxGuests ?? 0,
        })}
      />
    </article>
  );
}
