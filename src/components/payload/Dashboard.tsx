import { Gutter } from "@payloadcms/ui";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import {
  ForestScene,
  NightSky,
  NightTreeline,
  PondScene,
} from "@/components/shared/Tableaux";
import { DriveTimeRose } from "@/components/surroundings/DriveTimeRose";
import { defaultLocale } from "@/i18n/config";
import {
  ADMIN_PAGES,
  GUIDE_CHECK_MAX_AGE_DAYS,
  getAdminStats,
  getUnreadMessages,
} from "@/lib/admin-stats";
import { todayInParis } from "@/lib/availability/ical";
import { getAvailability } from "@/lib/availability/load";
import { occupancyRate, upcomingStays } from "@/lib/availability/occupancy";
import { formatRating } from "@/lib/platforms";
import { roseLabels } from "@/lib/rose-labels";
import { SITE_URL } from "@/lib/seo";
import Help from "./Help";

type Condition = [field: string, operator: string, value: string];

interface Task {
  figure: string;
  title: string;
  detail: string;
  href: string;
  isUrgent?: boolean;
}

const DAY_MS = 86_400_000;
const CHART_HEIGHT = 96;
const BAR_ROUNDING = 4;
const NEAR_MINUTES = 30;
const MONTH_DAYS = 30;
const OCCUPANCY_WINDOWS = [30, 90];
const STAYS_SHOWN = 4;

const plural = (count: number, one: string, many: string) =>
  count > 1 ? many : one;

const counted = (count: number, one: string, many: string) =>
  `${count} ${plural(count, one, many)}`;

const dayAndMonth = new Intl.DateTimeFormat("fr", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const monthName = new Intl.DateTimeFormat("fr", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const monthInitial = new Intl.DateTimeFormat("fr", {
  month: "narrow",
  timeZone: "UTC",
});

const monthOnly = new Intl.DateTimeFormat("fr", {
  month: "long",
  timeZone: "UTC",
});

function ago(date: string, today: string) {
  const days = Math.max(
    0,
    Math.round(
      (new Date(today).getTime() -
        new Date(todayInParis(new Date(date))).getTime()) /
        DAY_MS,
    ),
  );
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 2 * MONTH_DAYS) return `il y a ${days} jours`;

  return `il y a ${Math.round(days / MONTH_DAYS)} mois`;
}

const where = (...branches: Condition[][]) =>
  new URLSearchParams(
    branches.flatMap((conditions, branch) =>
      conditions.map(([field, operator, value], index) => [
        `where[or][${branch}][and][${index}][${field}][${operator}]`,
        value,
      ]),
    ),
  ).toString();

export default async function Dashboard({ payload, user }: ServerProps) {
  const adminRoute = payload.config.routes.admin;
  const to = (path: `/${string}`) => formatAdminURL({ adminRoute, path });
  const [stats, unread, availability, common] = await Promise.all([
    getAdminStats(),
    getUnreadMessages(),
    getAvailability(),
    getTranslations({ locale: defaultLocale, namespace: "common" }),
  ]);

  const today = todayInParis();
  const accountName =
    user && "name" in user && typeof user.name === "string" ? user.name : "";
  const greeted = stats.hosts || accountName;
  const { reviews, places, guides, photos, messages, platforms } = stats;
  const untranslated =
    places.withoutEnglish +
    guides.withoutEnglish +
    stats.pagesWithoutEnglish.length;
  const firstUntranslatedPage = stats.pagesWithoutEnglish[0];

  const tasks: Task[] = [
    unread > 0 && {
      figure: String(unread),
      title: plural(unread, "message à lire", "messages à lire"),
      detail: "Ouvrez le message, répondez, puis cochez « Message lu ».",
      href: `${to("/collections/contact-messages")}?${where([["readStatus", "not_equals", "true"]])}`,
      isUrgent: true,
    },
    reviews.pending > 0 && {
      figure: String(reviews.pending),
      title: plural(reviews.pending, "avis à valider", "avis à valider"),
      detail: "Passez-le en « Approuvé » pour qu'il apparaisse sur le site.",
      href: `${to("/collections/testimonials")}?${where([["status", "equals", "pending"]])}`,
      isUrgent: true,
    },
    stats.pricing.rates === 0 && {
      figure: "0",
      title: "prix de base saisi pour l'instant",
      detail: "Écrivez votre prix par nuit pour 2, 4 et 6 voyageurs.",
      href: to("/globals/pricing-config"),
      isUrgent: true,
    },
    guides.stale > 0 && {
      figure: String(guides.stale),
      title: plural(guides.stale, "guide à relire", "guides à relire"),
      detail: guides.oldest
        ? `Le plus ancien : « ${guides.oldest.title} », ${guides.oldest.checkedAt ? `vérifié ${ago(guides.oldest.checkedAt, today)}` : "jamais vérifié"}. Relisez horaires et tarifs, puis changez la date.`
        : `Horaires et tarifs vérifiés il y a plus de ${GUIDE_CHECK_MAX_AGE_DAYS / 30} mois.`,
      href: `${to("/collections/guides")}?${where(
        [
          ["checkedAt", "less_than", guides.staleBefore],
          ["_status", "equals", "published"],
        ],
        [
          ["checkedAt", "exists", "false"],
          ["_status", "equals", "published"],
        ],
      )}`,
      isUrgent: true,
    },
    untranslated > 0 && {
      figure: String(untranslated),
      title: plural(
        untranslated,
        "texte sans traduction anglaise",
        "textes sans traduction anglaise",
      ),
      detail: `${[
        places.withoutEnglish > 0 &&
          counted(places.withoutEnglish, "lieu", "lieux"),
        guides.withoutEnglish > 0 &&
          counted(guides.withoutEnglish, "guide", "guides"),
        ...stats.pagesWithoutEnglish.map(({ label }) => `page ${label}`),
      ]
        .filter(Boolean)
        .join(", ")}. Le site anglais affiche le français à la place.`,
      href: firstUntranslatedPage
        ? `${to(`/globals/${firstUntranslatedPage.slug}`)}?locale=en`
        : `${to(`/collections/${places.withoutEnglish > 0 ? "places" : "guides"}`)}?locale=en`,
    },
    photos.placePhotosWithoutCredit.length > 0 && {
      figure: String(photos.placePhotosWithoutCredit.length),
      title: plural(
        photos.placePhotosWithoutCredit.length,
        "photo de lieu sans crédit",
        "photos de lieux sans crédit",
      ),
      detail:
        "Indiquez l'auteur et la licence de chaque photo qui n'est pas la vôtre.",
      href: `${to("/collections/media")}?${where([["id", "in", photos.placePhotosWithoutCredit.join(",")]])}`,
    },
    places.withoutPhoto > 0 && {
      figure: String(places.withoutPhoto),
      title: plural(places.withoutPhoto, "lieu sans photo", "lieux sans photo"),
      detail:
        "Sa carte s'affiche sans image. Ajoutez une photo seulement si vous en avez le droit.",
      href: `${to("/collections/places")}?${where([["image", "exists", "false"]])}`,
    },
  ].filter((task) => task !== false);

  const urgent = tasks.filter((task) => task.isUrgent).length;
  const busiest = Math.max(1, ...messages.months.map(({ count }) => count));
  const [previousMonth, currentMonth] = messages.months.slice(-2);
  const monthGap =
    currentMonth && previousMonth
      ? currentMonth.count - previousMonth.count
      : 0;
  const lastMessage = messages.latest[0];
  const shownBySource = new Map<string, number>(
    reviews.bySource.map(({ source, count }) => [source, count]),
  );
  const listings = platforms.rated.map((platform) => ({
    ...platform,
    shown: shownBySource.get(platform.source) ?? 0,
  }));
  const notCopied = listings.reduce(
    (total, { reviewCount, shown }) => total + Math.max(0, reviewCount - shown),
    0,
  );
  const windows = availability
    ? OCCUPANCY_WINDOWS.map((days) =>
        occupancyRate(availability.taken, today, days),
      )
    : [];
  const stays = availability
    ? upcomingStays(availability.taken, today, STAYS_SHOWN)
    : [];
  const origin =
    stats.origin.lat !== null && stats.origin.lng !== null
      ? { lat: stats.origin.lat, lng: stats.origin.lng }
      : null;
  const nearby = stats.rose.filter(
    (place) => place.driveMin <= NEAR_MINUTES,
  ).length;

  return (
    <Gutter className="lit-resume">
      <header className="lit-tableau lit-resume-entete">
        <PondScene heron />
        <div className="lit-tableau-contenu">
          <h1>{greeted ? `Bonjour ${greeted}` : "Bonjour"}</h1>
          <p>
            {urgent === 0
              ? "Rien d'urgent aujourd'hui, le site est à jour."
              : urgent === 1
                ? "Une chose vous attend aujourd'hui."
                : `${urgent} choses vous attendent aujourd'hui.`}
          </p>
          <dl className="lit-reperes lit-reperes-dates">
            {lastMessage && (
              <div>
                <dt>dernier message reçu, de {lastMessage.name}</dt>
                <dd>{ago(lastMessage.createdAt, today)}</dd>
              </div>
            )}
            {reviews.latestAt && (
              <div>
                <dt>dernier avis ajouté au site</dt>
                <dd>{ago(reviews.latestAt, today)}</dd>
              </div>
            )}
          </dl>
          <a href={SITE_URL} target="_blank" rel="noopener">
            Voir le site
            <span className="lit-hors-ecran"> (ouvre un nouvel onglet)</span>
          </a>
        </div>
      </header>

      <div className="lit-blocs">
        <section className="lit-bloc" aria-labelledby="lit-taches">
          <h2 id="lit-taches">À faire maintenant</h2>
          {tasks.length === 0 ? (
            <div className="lit-tableau lit-vide-tableau">
              <ForestScene stag="broute" />
              <p className="lit-tableau-contenu">
                Rien à faire. Les messages sont lus, les prix et les guides sont
                à jour.
              </p>
            </div>
          ) : (
            <ul className="lit-taches">
              {tasks.map(({ figure, title, detail, href, isUrgent }) => (
                <li key={title} data-urgent={isUrgent || undefined}>
                  <Link href={href}>
                    <strong>{figure}</strong>
                    <span>{title}</span>
                    <small>{detail}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lit-bloc" aria-labelledby="lit-nuits">
          <h2 id="lit-nuits">
            Disponibilités
            <Help
              about="Disponibilités"
              text="Calculé à partir de vos calendriers Airbnb et Booking, relus toutes les deux heures. Une nuit que vous avez bloquée compte comme prise. Deux séjours qui se suivent sans nuit libre forment une seule ligne."
            />
          </h2>
          {!availability && (
            <div className="lit-tableau lit-vide-tableau">
              <ForestScene stag="ecoute" />
              <p className="lit-tableau-contenu">
                {stats.hasCalendars
                  ? "Les calendriers n'ont pas pu être lus. Vérifiez les deux liens dans "
                  : "Pour voir ici les nuits prises et les prochains séjours, collez les liens de vos calendriers Airbnb et Booking dans "}
                <Link href={to("/globals/site-settings")}>
                  Le gîte et ses coordonnées
                </Link>
                , onglet « Annonces et notes ».
              </p>
            </div>
          )}
          {availability && (
            <>
              <ul className="lit-occupation">
                {windows.map(({ days, occupied, rate }) => (
                  <li key={days}>
                    <p className="lit-chiffre">
                      <strong>{rate} %</strong>
                      des {days} prochaines nuits sont prises ({occupied} sur{" "}
                      {days})
                    </p>
                    <svg height="8" aria-hidden="true">
                      <rect width={`${rate}%`} height="8" rx={BAR_ROUNDING} />
                    </svg>
                  </li>
                ))}
              </ul>
              {stays.length === 0 ? (
                <p className="lit-vide">
                  Aucun séjour à venir dans le calendrier.
                </p>
              ) : (
                <ul className="lit-lignes">
                  {stays.map(({ arrival, departure, nights, isOngoing }) => (
                    <li key={arrival}>
                      <span>
                        {isOngoing
                          ? `En cours, départ le ${dayAndMonth.format(new Date(departure))}`
                          : `Du ${dayAndMonth.format(new Date(arrival))} au ${dayAndMonth.format(new Date(departure))}`}
                      </span>
                      <span>{counted(nights, "nuit", "nuits")}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <section className="lit-bloc" aria-labelledby="lit-raccourcis">
          <h2 id="lit-raccourcis">Modifier une page</h2>
          <ul className="lit-raccourcis">
            {ADMIN_PAGES.map(({ slug, label }) => (
              <li key={slug}>
                <Link href={to(`/globals/${slug}`)}>{label}</Link>
              </li>
            ))}
          </ul>
          <p className="lit-chapeau">
            Chaque modification est visible sur le site dès que vous touchez «
            Publier ».
          </p>
          <details className="lit-installer">
            <summary>Installer sur votre téléphone</summary>
            <p>
              Cet espace s&apos;ouvre alors comme une application, depuis une
              icône jaune sur l&apos;écran d&apos;accueil.
            </p>
            <dl>
              <div>
                <dt>Sur Android (Chrome)</dt>
                <dd>
                  Touchez les trois points en haut à droite, puis « Ajouter à
                  l&apos;écran d&apos;accueil ».
                </dd>
              </div>
              <div>
                <dt>Sur iPhone (Safari)</dt>
                <dd>
                  Touchez le bouton « Partager », puis « Sur l&apos;écran
                  d&apos;accueil ».
                </dd>
              </div>
            </dl>
          </details>
        </section>

        <section className="lit-bloc" aria-labelledby="lit-avis">
          <h2 id="lit-avis">
            Note des voyageurs
            <Help
              about="Note des voyageurs"
              text="C'est la note affichée sur le site et transmise à Google. Elle est calculée à partir des notes et du nombre d'avis de vos annonces, que vous saisissez dans « Le gîte et ses coordonnées », onglet « Annonces et notes »."
            />
          </h2>
          {platforms.overall === null ? (
            <p className="lit-vide">
              Aucune note pour l&apos;instant.{" "}
              <Link href={to("/globals/site-settings")}>
                Saisir les notes de vos annonces
              </Link>
            </p>
          ) : (
            <>
              <p className="lit-chiffre">
                <strong>
                  {formatRating(platforms.overall.ratingValue, "fr")}
                </strong>
                sur 5, la moyenne de vos annonces telle que le site
                l&apos;affiche
              </p>
              <ul className="lit-lignes">
                {listings.map(
                  ({ source, name, rating, scale, reviewCount, shown }) => (
                    <li key={source}>
                      <span>
                        {name}, {formatRating(rating, "fr")} sur {scale}
                      </span>
                      <span>
                        {counted(reviewCount, "avis", "avis")}, dont {shown} sur
                        le site
                      </span>
                    </li>
                  ),
                )}
              </ul>
              {notCopied > 0 && (
                <p className="lit-chapeau">
                  {notCopied}{" "}
                  {plural(
                    notCopied,
                    "avis de vos annonces n'est pas encore recopié",
                    "avis de vos annonces ne sont pas encore recopiés",
                  )}{" "}
                  sur le site.{" "}
                  <Link href={to("/collections/testimonials/create")}>
                    Recopier un avis
                  </Link>
                </p>
              )}
            </>
          )}
        </section>

        <section className="lit-bloc" aria-labelledby="lit-messages">
          <h2 id="lit-messages">
            Messages reçus
            <Help
              about="Messages reçus"
              text="Les demandes envoyées depuis le formulaire de la page « Contact », mois par mois sur un an. Les réservations faites directement sur Airbnb ou Booking n'y figurent pas."
            />
          </h2>
          {currentMonth && previousMonth && (
            <p className="lit-chiffre">
              <strong>{currentMonth.count}</strong>
              en {monthOnly.format(new Date(`${currentMonth.month}-01`))},{" "}
              {monthGap === 0
                ? "autant qu'en"
                : `${Math.abs(monthGap)} de ${monthGap > 0 ? "plus" : "moins"} qu'en`}{" "}
              {monthOnly.format(new Date(`${previousMonth.month}-01`))}
            </p>
          )}
          <ol className="lit-barres">
            {messages.months.map(({ month, count }, index) => {
              const date = new Date(`${month}-01T00:00:00Z`);
              const height = Math.round((count / busiest) * CHART_HEIGHT);

              return (
                <li
                  key={month}
                  data-courant={
                    index === messages.months.length - 1 || undefined
                  }
                >
                  <span aria-hidden="true">{count > 0 ? count : ""}</span>
                  <svg height={CHART_HEIGHT} aria-hidden="true">
                    <rect
                      y={CHART_HEIGHT - height}
                      width="100%"
                      height={height + BAR_ROUNDING}
                      rx={BAR_ROUNDING}
                    />
                  </svg>
                  <abbr title={monthName.format(date)}>
                    {monthInitial.format(date).toUpperCase()}
                  </abbr>
                  <span className="lit-hors-ecran">
                    {" "}
                    : {counted(count, "message", "messages")}
                  </span>
                </li>
              );
            })}
          </ol>
          {messages.latest.length > 0 && (
            <ul className="lit-lignes lit-derniers">
              {messages.latest.map(({ id, subject, name, isRead }) => (
                <li key={id}>
                  <Link href={to(`/collections/contact-messages/${id}`)}>
                    <strong>{subject}</strong>
                    <span>{name}</span>
                  </Link>
                  <span className="lit-etat" data-etat={isRead ? "oui" : "non"}>
                    {isRead ? "Lu" : "À lire"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="lit-resume-alentours" aria-labelledby="lit-contenu">
        <h2 id="lit-contenu">
          Autour du gîte
          <Help
            about="Autour du gîte"
            text="C'est la carte des temps de route du site. Le gîte est au centre, chaque point est un lieu, placé dans sa vraie direction. Plus un point est loin du centre, plus la route est longue : un cercle vaut 15 minutes. Les gros points sont les lieux mis en avant, la couleur indique la catégorie."
          />
        </h2>
        <p className="lit-chapeau">
          {counted(places.total, "lieu", "lieux")}, dont {nearby} à{" "}
          {NEAR_MINUTES} minutes ou moins du gîte.{" "}
          <Link href={to("/collections/places/create")}>Ajouter un lieu</Link>
        </p>
        {origin && (
          <figure className="lit-rose-cadre">
            <ul className="lit-rose-legende">
              {places.byCategory.map(({ category, label, count }) => (
                <li key={category} className={`categorie-${category}`}>
                  {label}
                  <span>{count}</span>
                </li>
              ))}
            </ul>
            <DriveTimeRose
              origin={origin}
              places={stats.rose}
              labels={roseLabels(common)}
            />
          </figure>
        )}
      </section>

      <div className="lit-resume-pied">
        <NightTreeline />
        <section
          className="lit-tableau lit-resume-nuit"
          aria-labelledby="lit-maison"
        >
          <NightSky />
          <div className="lit-tableau-contenu">
            <h2 id="lit-maison">La maison, telle que le site l&apos;annonce</h2>
            {stats.facts && (
              <dl className="lit-reperes">
                <div>
                  <dt>m² habitables</dt>
                  <dd>{stats.facts.surface}</dd>
                </div>
                <div>
                  <dt>
                    {plural(
                      stats.facts.maxGuests ?? 0,
                      "voyageur",
                      "voyageurs",
                    )}{" "}
                    au plus
                  </dt>
                  <dd>{stats.facts.maxGuests}</dd>
                </div>
                <div>
                  <dt>
                    {plural(stats.facts.bedrooms ?? 0, "chambre", "chambres")}
                  </dt>
                  <dd>{stats.facts.bedrooms}</dd>
                </div>
                <div>
                  <dt>
                    {plural(
                      stats.facts.bathrooms ?? 0,
                      "salle de bain",
                      "salles de bain",
                    )}
                  </dt>
                  <dd>{stats.facts.bathrooms}</dd>
                </div>
              </dl>
            )}
            <p>
              Ces chiffres doivent rester ceux de vos annonces Airbnb et
              Booking.{" "}
              <Link href={to("/globals/site-settings")}>
                Les corriger dans Le gîte et ses coordonnées
              </Link>
            </p>
          </div>
        </section>
      </div>
    </Gutter>
  );
}
