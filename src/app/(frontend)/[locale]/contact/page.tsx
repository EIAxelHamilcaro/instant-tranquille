import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { AreaMap } from "@/components/shared/AreaMap";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import { Sketch } from "@/components/shared/Sketch";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, cottageReference } from "@/lib/jsonld";
import { getGlobal, getGuides, getReviews } from "@/lib/queries";
import { reviewsAbout } from "@/lib/review-topics";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { pageShareImage } from "@/lib/share-image/content";

const ACCESS_GUIDE = "venir-a-romorantin-lanthenay";

interface ContactPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const page = await getGlobal("contact-page", locale);

  return pageMetadata({
    locale,
    href: "/contact",
    title: page.title,
    description: page.lede ?? "",
    meta: page.meta,
    share: await pageShareImage("contact", locale),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, common, page, cottage, settings, reviews, guides] =
    await Promise.all([
      getTranslations("contact"),
      getTranslations("common"),
      getGlobal("contact-page", locale),
      getGlobal("cottage-page", locale),
      getGlobal("site-settings", locale),
      getReviews(locale),
      getGuides(locale),
    ]);

  const { contact, hosts } = settings;
  const routes = settings.accessRoutes ?? [];
  const { lat, lng, zoom, markerLabel } = contact?.coordinates ?? {};
  const hasCoordinates = typeof lat === "number" && typeof lng === "number";
  const [welcomeReview] = reviewsAbout(reviews, "welcome");
  const hasAccessGuide = guides.some((guide) => guide.slug === ACCESS_GUIDE);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(locale, [
            { name: common("nav.contact"), href: "/contact" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: absoluteUrl("/contact", locale),
            name: page.title,
            description: page.lede ?? undefined,
            inLanguage: locale,
            about: cottageReference,
            mainEntity: cottageReference,
          },
        ]}
      />

      <PageHero
        title={page.title}
        lede={page.lede}
        image={page.image ?? cottage.rooms?.[0]?.photos?.[0]?.image}
        crumbs={[{ label: common("nav.contact") }]}
      >
        <BookingButtons settings={settings} />
      </PageHero>

      <div className="correspondance page section-serree grid gap-x-12 gap-y-14 lg:grid-cols-12">
        <section className="grid content-start gap-6 lg:col-span-5">
          <h2>{hosts ? t("hostsTitle", { hosts }) : t("detailsTitle")}</h2>
          {page.hostsNote && (
            <figure>
              <blockquote className="citation">{page.hostsNote}</blockquote>
              {hosts && <figcaption className="signataire">{hosts}</figcaption>}
            </figure>
          )}
          {welcomeReview && (
            <figure className="temoin">
              <blockquote>{welcomeReview.text}</blockquote>
              <figcaption className="ui">
                {welcomeReview.guestName}
                <span className="discret">, {t("reviewLabel")}</span>
              </figcaption>
            </figure>
          )}
        </section>

        <section className="courrier section-claire lg:col-span-7 lg:row-span-2">
          <h2>{t("formTitle")}</h2>
          <ContactForm />
        </section>

        <section className="lg:col-span-5">
          <h2 className="sr-only">{t("detailsTitle")}</h2>
          <dl className="coordonnees">
            {contact?.phone && (
              <div>
                <dt>{t("phoneLabel")}</dt>
                <dd>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="lien"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
            )}
            {contact?.email && (
              <div>
                <dt>{t("emailLabel")}</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="lien">
                    {contact.email}
                  </a>
                </dd>
              </div>
            )}
            {contact?.address && (
              <div>
                <dt>{t("addressLabel")}</dt>
                <dd>
                  <address>
                    {contact.address}
                    <br />
                    {contact.postalCode} {contact.city}
                  </address>
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <Sketch kind="rive" />
      <section id="acces" className="section section-claire ancre">
        <div className="page grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <h2 className="lg:col-span-12">{t("accessTitle")}</h2>

          {hasCoordinates && (
            <figure className="lg:col-span-7">
              <AreaMap
                lat={lat}
                lng={lng}
                zoom={zoom ?? undefined}
                label={t("mapLabel")}
                markerLabel={markerLabel || common("siteName")}
              />
              <figcaption className="legende">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  className="lien"
                  rel="noopener"
                  target="_blank"
                >
                  {t("directionsLink")}
                  <span className="sr-only"> ({common("opensNewTab")})</span>
                </a>
              </figcaption>
            </figure>
          )}

          <div className="grid content-start gap-8 lg:col-span-5">
            <ul className="routes">
              {routes.map((route) => (
                <li key={route.id ?? route.from}>
                  <h3>{t("routeFrom", { from: route.from })}</h3>
                  <p className="duree">
                    {route.duration}
                    <small>{route.distance}</small>
                  </p>
                  <p className="discret">{route.description}</p>
                </li>
              ))}
            </ul>
            {hasAccessGuide && (
              <Link
                href={{
                  pathname: "/guides/[slug]",
                  params: { slug: ACCESS_GUIDE },
                }}
                className="ui lien justify-self-start"
              >
                {t("accessGuideLink")}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="appel section">
        <div className="page grid justify-items-start gap-6">
          <h2>{page.bookingTitle}</h2>
          <p className="chapeau">{page.bookingText}</p>
          <BookingButtons settings={settings} />
          <Link href="/tarifs-reservation" className="ui lien">
            {t("ratesLink")}
          </Link>
        </div>
      </section>
    </>
  );
}
