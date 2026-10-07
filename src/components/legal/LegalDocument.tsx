import { getTranslations } from "next-intl/server";
import { Fragment } from "react";
import { JsonLd } from "@/components/shared/JsonLd";
import { PageHero } from "@/components/shared/PageHero";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import {
  LEGAL_DOCUMENTS,
  LEGAL_UPDATED_AT,
  type LegalDocumentKey,
} from "@/lib/legal";
import { formatLongDate } from "@/lib/platforms";
import { getGlobal } from "@/lib/queries";

const EXTERNAL_LINKS = {
  vercel: "https://vercel.com",
  cnil: "https://www.cnil.fr",
  osm: "https://www.openstreetmap.org/copyright",
  osrm: "https://project-osrm.org",
};

interface LegalDocumentProps {
  document: LegalDocumentKey;
  locale: Locale;
}

export async function LegalDocument({ document, locale }: LegalDocumentProps) {
  const [t, common, settings] = await Promise.all([
    getTranslations("legal"),
    getTranslations("common"),
    getGlobal("site-settings", locale),
  ]);
  const { href, sections } = LEGAL_DOCUMENTS[document];
  const { contact, hosts } = settings;
  const email = contact?.email ?? "";

  const externalLinks = Object.fromEntries(
    Object.entries(EXTERNAL_LINKS).map(([name, url]) => [
      name,
      (chunks: React.ReactNode) => (
        <a href={url} rel="noopener" target="_blank">
          {chunks}
          <span className="sr-only"> ({common("opensNewTab")})</span>
        </a>
      ),
    ]),
  );
  const values = {
    hosts: hosts ?? "",
    address: contact?.address ?? "",
    postalCode: contact?.postalCode ?? "",
    city: contact?.city ?? "",
    email,
    p: (chunks: React.ReactNode) => <p>{chunks}</p>,
    ul: (chunks: React.ReactNode) => <ul>{chunks}</ul>,
    li: (chunks: React.ReactNode) => <li>{chunks}</li>,
    mail: (chunks: React.ReactNode) => <a href={`mailto:${email}`}>{chunks}</a>,
    privacy: (chunks: React.ReactNode) => (
      <Link href="/confidentialite">{chunks}</Link>
    ),
    ...externalLinks,
  };

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t(`${document}.title`), href },
        ])}
      />

      <PageHero
        title={t(`${document}.title`)}
        lede={t(`${document}.lede`)}
        crumbs={[{ label: t(`${document}.title`) }]}
      >
        <p className="ui discret">
          {t.rich("updated", {
            date: formatLongDate(LEGAL_UPDATED_AT, locale),
            time: (chunks) => <time dateTime={LEGAL_UPDATED_AT}>{chunks}</time>,
          })}
        </p>
      </PageHero>

      <article className="page section">
        <div className="prose">
          {sections.map((section) => (
            <Fragment key={section}>
              <h2>{t(`${document}.sections.${section}.title`)}</h2>
              {t.rich(`${document}.sections.${section}.body`, values)}
            </Fragment>
          ))}
        </div>
      </article>
    </>
  );
}
