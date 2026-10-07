import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { Sketch } from "@/components/shared/Sketch";
import { GuideCards } from "@/components/surroundings/GuideCards";
import { StayCall } from "@/components/surroundings/StayCall";
import { ThemeFilter } from "@/components/surroundings/ThemeFilter";
import type { Locale } from "@/i18n/config";
import { breadcrumbJsonLd, guideListJsonLd } from "@/lib/jsonld";
import { PLACE_CATEGORIES } from "@/lib/places";
import { getGlobal, getGuides } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";

const COUNT_TOKEN = "{count}";

const withCount = (text: string | null | undefined, count: number) =>
  (text ?? "").replaceAll(COUNT_TOKEN, String(count));

interface GuidesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: GuidesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const [page, guides] = await Promise.all([
    getGlobal("guides-page", locale),
    getGuides(locale),
  ]);

  return pageMetadata({
    locale,
    href: "/guides",
    title: page.title,
    description: withCount(page.lede, guides.length),
    meta: page.meta,
    share: await pageShareImage("guides", locale),
  });
}

export default async function GuidesPage({ params }: GuidesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, page, guides, settings] = await Promise.all([
    getTranslations("guides"),
    getTranslations("common"),
    getGlobal("guides-page", locale),
    getGuides(locale),
    getGlobal("site-settings", locale),
  ]);

  const [lead] = [...guides].sort(
    (a, b) => (b.places?.length ?? 0) - (a.places?.length ?? 0),
  );
  const heroImage =
    page.image ??
    lead?.image ??
    guides.find((guide) => guide.image)?.image ??
    null;
  const themes = PLACE_CATEGORIES.filter((theme) =>
    guides.some((guide) => guide.theme === theme && guide.id !== lead?.id),
  );
  const others = themes.flatMap((theme) =>
    guides.filter((guide) => guide.theme === theme && guide.id !== lead?.id),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: common("nav.guides"), href: "/guides" },
          ]),
          guideListJsonLd(page.title, guides, locale),
        ]}
      />

      <PageHero
        title={page.title}
        lede={withCount(page.lede, guides.length)}
        image={heroImage}
        crumbs={[{ label: common("nav.guides") }]}
      />

      {lead && (
        <section
          className="section-serree section-claire"
          aria-labelledby="guide-une"
        >
          <div className="page grid gap-8">
            <h2 id="guide-une">{page.leadTitle}</h2>
            <GuideCards guides={[lead]} featured />
          </div>
        </section>
      )}

      <Sketch kind="vol" above />
      {others.length > 0 && (
        <section
          className="page section grid gap-8"
          aria-labelledby="tous-les-guides"
        >
          <h2 id="tous-les-guides">{page.allTitle}</h2>
          <ThemeFilter
            label={t("themesNav")}
            allLabel={t("allThemes")}
            options={themes.map((theme) => ({
              value: theme,
              label: common(`categories.${theme}`),
              count: others.filter((guide) => guide.theme === theme).length,
            }))}
          >
            <GuideCards guides={others} />
          </ThemeFilter>
        </section>
      )}

      <StayCall
        settings={settings}
        text={t("stayText", {
          count: settings.propertyDetails?.maxGuests ?? 0,
        })}
      />
    </>
  );
}
