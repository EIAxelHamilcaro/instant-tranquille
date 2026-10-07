import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import type { ServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { formatQuoteDate } from "@/lib/platforms";
import { SITE_URL } from "@/lib/seo";

const PAGES = [
  { slug: "home-page", label: "Accueil" },
  { slug: "cottage-page", label: "Le gîte" },
  { slug: "surroundings-page", label: "Les alentours" },
  { slug: "guides-page", label: "Guides" },
  { slug: "rates-page", label: "Tarifs" },
  { slug: "contact-page", label: "Contact" },
] as const;

const QUOTE_MAX_AGE_DAYS = 90;
const DAY_MS = 86_400_000;

const plural = (count: number, one: string, many: string) =>
  `${count} ${count > 1 ? many : one}`;

const UNTRANSLATED = [
  { collection: "places", field: "name", one: "lieu", many: "lieux" },
  { collection: "guides", field: "title", one: "guide", many: "guides" },
] as const;

export default async function Dashboard({
  payload,
  user,
  locale,
}: ServerProps) {
  const adminRoute = payload.config.routes.admin;
  const to = (path: `/${string}`) => formatAdminURL({ adminRoute, path });
  const count = (
    collection: "contact-messages" | "testimonials" | "places" | "guides",
    where = {},
  ) => payload.count({ collection, where }).then((result) => result.totalDocs);

  const untranslatedPages = await Promise.all(
    PAGES.map(({ slug, label }) =>
      payload
        .findGlobal({ slug, locale: "en", fallbackLocale: false, depth: 0 })
        .then((page) => (page.title ? null : `page ${label}`)),
    ),
  );
  const untranslatedEntries = await Promise.all(
    UNTRANSLATED.map(({ collection, field, one, many }) =>
      payload
        .count({
          collection,
          locale: "en",
          where: {
            or: [{ [field]: { exists: false } }, { [field]: { equals: "" } }],
          },
        })
        .then(({ totalDocs }) =>
          totalDocs > 0 ? plural(totalDocs, one, many) : null,
        ),
    ),
  );
  const untranslated = [...untranslatedEntries, ...untranslatedPages].filter(
    (item) => item !== null,
  );
  const siteHref = locale?.code === "en" ? `${SITE_URL}/en` : SITE_URL;

  const [unread, pending, reviews, places, guides, pricing, settings] =
    await Promise.all([
      count("contact-messages", { readStatus: { not_equals: true } }),
      count("testimonials", { status: { equals: "pending" } }),
      count("testimonials", { status: { equals: "approved" } }),
      count("places"),
      count("guides", { _status: { equals: "published" } }),
      payload.findGlobal({ slug: "pricing-config", depth: 0 }),
      payload.findGlobal({ slug: "site-settings", depth: 0 }),
    ]);

  const firstName =
    user && "name" in user && typeof user.name === "string" ? user.name : "";
  const quoteAge = pricing.quotedOn
    ? Math.floor((Date.now() - new Date(pricing.quotedOn).getTime()) / DAY_MS)
    : null;
  const facts = settings.propertyDetails;

  const gestures = [
    {
      href: to("/collections/contact-messages"),
      title: "Lire les messages",
      detail:
        unread > 0
          ? `${plural(unread, "message non lu", "messages non lus")}`
          : "Aucun message en attente",
      isUrgent: unread > 0,
    },
    {
      href: to("/globals/pricing-config"),
      title: "Changer les tarifs",
      detail:
        pricing.quotedOn && quoteAge !== null
          ? quoteAge > QUOTE_MAX_AGE_DAYS
            ? `Prix relevés le ${formatQuoteDate(pricing.quotedOn, "fr")} : vérifiez qu'ils sont toujours justes`
            : `Prix relevés le ${formatQuoteDate(pricing.quotedOn, "fr")}`
          : "Aucun prix relevé pour l'instant",
      isUrgent: quoteAge !== null && quoteAge > QUOTE_MAX_AGE_DAYS,
    },
    {
      href: to("/collections/testimonials/create"),
      title: "Ajouter un avis",
      detail:
        pending > 0
          ? `${plural(pending, "avis attend", "avis attendent")} votre validation`
          : `${plural(reviews, "avis affiché", "avis affichés")} sur le site`,
      isUrgent: pending > 0,
    },
    {
      href: to("/collections/media/create"),
      title: "Ajouter une photo",
      detail: "Puis choisissez-la dans une page, un lieu ou un guide",
    },
    {
      href: to("/collections/places/create"),
      title: "Ajouter un lieu",
      detail: `${plural(places, "lieu", "lieux")} autour du gîte, ${plural(guides, "guide publié", "guides publiés")}`,
    },
  ];

  return (
    <Gutter className="lit-bord">
      <header className="lit-bord-entete">
        <h1>{firstName ? `Bonjour ${firstName}` : "Bonjour"}</h1>
        <p>
          Que voulez-vous faire aujourd&apos;hui ? Chaque modification est
          visible sur le site dès que vous cliquez sur « Publier ».
        </p>
        <a
          className="lit-bord-site"
          href={siteHref}
          target="_blank"
          rel="noopener"
        >
          Voir le site
          <span className="lit-hors-ecran"> (ouvre un nouvel onglet)</span>
        </a>
      </header>

      <ul className="lit-gestes">
        {gestures.map(({ href, title, detail, isUrgent }) => (
          <li key={href} data-urgent={isUrgent || undefined}>
            <Link href={href}>
              <strong>{title}</strong>
              <span>{detail}</span>
            </Link>
          </li>
        ))}
        <li className="lit-geste-pages">
          <strong>Modifier une page</strong>
          <ul>
            {PAGES.map(({ slug, label }) => (
              <li key={slug}>
                <Link href={to(`/globals/${slug}`)}>{label}</Link>
              </li>
            ))}
          </ul>
        </li>
      </ul>

      <section className="lit-bord-langues">
        <h2>Le site existe en français et en anglais</h2>
        <p>
          Pour traduire une page, ouvrez-la, choisissez « Anglais » dans «
          Langue du contenu » en haut à droite, puis écrivez le texte anglais.
          Le menu à trois points propose « Copier vers une autre langue » pour
          partir du texte français.
        </p>
        <p data-manque={untranslated.length > 0 || undefined}>
          {untranslated.length > 0
            ? `Sans traduction anglaise pour l'instant : ${untranslated.join(", ")}. Le site anglais affiche le texte français à la place.`
            : "Tout est traduit en anglais."}
        </p>
      </section>

      {facts && (
        <p className="lit-bord-faits">
          La maison, telle que le site l&apos;annonce : {facts.surface} m²,{" "}
          {facts.maxGuests} personnes, {facts.bedrooms} chambres,{" "}
          {plural(facts.bathrooms ?? 0, "salle de bain", "salles de bain")}.{" "}
          <Link href={to("/globals/site-settings")}>
            Coordonnées et réglages
          </Link>
        </p>
      )}
    </Gutter>
  );
}
