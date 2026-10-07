import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter, SetStepNav } from "@payloadcms/ui";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { Seam } from "@/components/shared/Seam";
import { ADMIN_PAGES } from "@/lib/admin-stats";
import { SITE_URL } from "@/lib/seo";

const RELATED = [
  {
    path: "/globals/pricing-config",
    label: "Tarifs et conditions",
    detail: "Les prix, les horaires d'arrivée et de départ, l'annulation.",
  },
  {
    path: "/collections/amenities",
    label: "Équipements du gîte",
    detail: "La liste affichée sur la page « Le gîte ».",
  },
  {
    path: "/collections/media",
    label: "Photos",
    detail: "Toutes les photos, à choisir ensuite dans les pages.",
  },
  {
    path: "/collections/testimonials",
    label: "Avis des voyageurs",
    detail: "Les avis qui défilent sur l'accueil et les autres pages.",
  },
  {
    path: "/globals/site-settings",
    label: "Le gîte et ses coordonnées",
    detail: "Adresse, téléphone, annonces, questions fréquentes.",
  },
] as const;

const NAV = [{ label: "Pages du site" }];

const modified = new Intl.DateTimeFormat("fr", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
});

export default async function PagesView({
  initPageResult,
  params,
  searchParams,
}: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult;
  const { payload, user, i18n } = req;
  const adminRoute = payload.config.routes.admin;
  const to = (path: `/${string}`) => formatAdminURL({ adminRoute, path });
  if (!user) redirect(to("/login"));

  const pages = await Promise.all(
    ADMIN_PAGES.map(async (page) => {
      const { title, _status, updatedAt } = await payload.findGlobal({
        slug: page.slug,
        draft: true,
        depth: 0,
        select: { title: true, _status: true, updatedAt: true },
      });

      return { ...page, title, isDraft: _status === "draft", updatedAt };
    }),
  );

  return (
    <DefaultTemplate
      i18n={i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      req={req}
      searchParams={searchParams}
      user={user}
      visibleEntities={visibleEntities}
    >
      <SetStepNav nav={NAV} />
      <Gutter className="lit-pages">
        <header className="lit-pages-entete">
          <h1>Les pages du site</h1>
          <div className="lit-ecran">
            <p className="lit-ecran-role">
              Six pages, dans l&apos;ordre du menu du site. Touchez une page
              pour changer ses textes et ses photos.
            </p>
            <Seam kind="arbres" />
          </div>
        </header>

        <section>
          <ol className="lit-pages-liste">
            {pages.map(({ slug, label, path, title, isDraft, updatedAt }) => (
              <li key={slug}>
                <Link href={to(`/globals/${slug}`)}>
                  <strong>{label}</strong>
                  {title && <span>{title}</span>}
                  <small data-brouillon={isDraft || undefined}>
                    {isDraft
                      ? "Des modifications ne sont pas encore publiées"
                      : updatedAt
                        ? `En ligne, modifiée le ${modified.format(new Date(updatedAt))}`
                        : "En ligne"}
                  </small>
                </Link>
                <a
                  href={`${SITE_URL}${path === "/" ? "" : path}`}
                  target="_blank"
                  rel="noopener"
                >
                  Voir
                  <span className="lit-hors-ecran">
                    {" "}
                    la page {label} sur le site (ouvre un nouvel onglet)
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Ce que les pages reprennent</h2>
          <p className="lit-chapeau">
            Ces contenus se modifient à part, puis s&apos;affichent sur
            plusieurs pages à la fois.
          </p>
          <ul className="lit-pages-liste">
            {RELATED.map(({ path, label, detail }) => (
              <li key={path}>
                <Link href={to(path)}>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Gutter>
    </DefaultTemplate>
  );
}
