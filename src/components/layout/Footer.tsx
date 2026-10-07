import { ArrowUp, ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Emblem } from "@/components/shared/Logo";
import { NightSky, NightTreeline } from "@/components/shared/Tableaux";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import { PLACE_CATEGORIES } from "@/lib/places";
import { getGlobal, getGuides, getOfficialSites } from "@/lib/queries";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ReplayOpening } from "./ReplayOpening";

const MAX_GUIDE_THEMES = 6;
const POND_RINGS = [34, 56, 84, 120, 166, 224, 296, 386, 500, 640, 820];

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const [t, settings, guides, sites] = await Promise.all([
    getTranslations("common"),
    getGlobal("site-settings", locale),
    getGuides(locale),
    getOfficialSites(locale),
  ]);
  const footerSites = sites.filter((site) => site.showInFooter);
  const { contact, hosts, propertyDetails: property } = settings;
  const { lat, lng } = contact?.coordinates ?? {};

  const themes = PLACE_CATEGORIES.map((theme) => ({
    theme,
    count: guides.filter((guide) => guide.theme === theme).length,
  }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_GUIDE_THEMES);

  return (
    <>
      <NightTreeline />
      <footer className="pied section-sombre">
        <NightSky />
        <div className="pied-carnet page">
          <div className="pied-fiche">
            <h2>
              <Link href="/">{t("siteName")}</Link>
            </h2>

            <address>
              {contact?.address && (
                <span className="toponyme">
                  {contact.address}
                  <br />
                  {contact.postalCode} {contact.city}
                </span>
              )}
              {contact?.phone && (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              )}
            </address>

            {property?.surface && property.maxGuests && property.bedrooms && (
              <p className="discret">
                {t("footer.facts", {
                  surface: property.surface,
                  guests: property.maxGuests,
                  bedrooms: property.bedrooms,
                })}
              </p>
            )}

            <BookingButtons settings={settings} />

            <p className="ui flex flex-wrap gap-x-6 gap-y-1">
              <Link
                href={{ pathname: "/contact", hash: "acces" }}
                className="lien"
              >
                {t("footer.seeMap")}
              </Link>
              {typeof lat === "number" && typeof lng === "number" && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  className="lien"
                  rel="noopener"
                  target="_blank"
                >
                  {t("footer.directions")}&nbsp;
                  <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only"> ({t("opensNewTab")})</span>
                </a>
              )}
              <Link href="/contact" className="lien">
                {hosts ? t("footer.writeTo", { hosts }) : t("footer.write")}
              </Link>
            </p>
          </div>

          <nav aria-label={t("footer.explore")} className="pied-liste">
            <h3>{t("footer.explore")}</h3>
            <ul>
              {NAV_ITEMS.map(({ key, href }) => (
                <li key={href}>
                  <Link href={href}>{t(`nav.${key}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.guides")} className="pied-liste">
            <h3>{t("footer.guides")}</h3>
            <ul>
              {themes.map(({ theme, count }) => (
                <li key={theme}>
                  <Link href={{ pathname: "/guides", hash: `theme-${theme}` }}>
                    {t(`categories.${theme}`)}
                    <span className="compte">
                      {t("footer.guideCount", { count })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/guides" className="ui lien">
              {t("footer.allGuides", { count: guides.length })}
            </Link>
          </nav>

          <nav aria-label={t("footer.tourism")} className="pied-liste">
            <h3>{t("footer.tourism")}</h3>
            <ul>
              {footerSites.map((site) => (
                <li key={site.id}>
                  <a href={site.url} rel="noopener" target="_blank">
                    {site.name}&nbsp;
                    <ArrowUpRight aria-hidden="true" />
                    <span className="sr-only"> ({t("opensNewTab")})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ReplayOpening className="pied-heron" label={t("opening.replay")}>
            <Emblem className="heron-vif" entrance="visible">
              {POND_RINGS.map((radius) => (
                <ellipse
                  key={radius}
                  className="pied-onde"
                  cx="29"
                  cy="56.5"
                  rx={radius}
                  ry={radius / 4}
                />
              ))}
              <ellipse
                className="pied-ride"
                cx="29"
                cy="56.5"
                rx="18"
                ry="4.5"
              />
              <ellipse
                className="pied-ride"
                cx="29"
                cy="56.5"
                rx="18"
                ry="4.5"
              />
            </Emblem>
          </ReplayOpening>
        </div>

        <div className="pied-mentions page">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <Link href="/mentions-legales">{t("footer.legalNotice")}</Link>
          <Link href="/confidentialite">{t("footer.privacy")}</Link>
          <LocaleSwitcher className="gap-5" />
          <a href="#contenu">
            {t("footer.top")}
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}
