import {
  DefaultNavClient,
  NavHamburger,
  NavWrapper,
} from "@payloadcms/next/client";
import { Logout } from "@payloadcms/ui";
import { EntityType, type NavGroupType } from "@payloadcms/ui/shared";
import Link from "next/link";
import type { ServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import { getUnreadMessages } from "@/lib/admin-stats";
import { SITE_URL } from "@/lib/seo";
import { Heron } from "./Heron";
import NavHome from "./NavHome";

interface NavItem {
  type: EntityType;
  slug: string;
}

const collection = (slug: string): NavItem => ({
  type: EntityType.collection,
  slug,
});
const global = (slug: string): NavItem => ({ type: EntityType.global, slug });

const NAVIGATION: { label: string; items: NavItem[] }[] = [
  {
    label: "Pages du site",
    items: [
      global("home-page"),
      global("cottage-page"),
      collection("amenities"),
      global("surroundings-page"),
      global("guides-page"),
      global("rates-page"),
      global("contact-page"),
      collection("media"),
    ],
  },
  {
    label: "Autour du gîte",
    items: [
      collection("places"),
      collection("guides"),
      collection("official-sites"),
    ],
  },
  {
    label: "Avis et réservations",
    items: [
      collection("testimonials"),
      global("pricing-config"),
      collection("contact-messages"),
    ],
  },
  {
    label: "Réglages",
    items: [
      global("site-settings"),
      collection("redirects"),
      collection("users"),
    ],
  },
];

const BASE_CLASS = "nav";
const NAV_PREFERENCES = { open: true, groups: {} };

export default async function Nav({
  payload,
  permissions,
  visibleEntities,
  locale,
}: ServerProps) {
  const siteHref = locale?.code === "en" ? `${SITE_URL}/en` : SITE_URL;
  const { collections, globals, routes } = payload.config;
  const unread = await getUnreadMessages();

  const labelOf = ({ type, slug }: NavItem) => {
    if (type === EntityType.collection) {
      const label = collections.find((item) => item.slug === slug)?.labels
        .plural;
      const text = typeof label === "string" ? label : slug;

      return slug === "contact-messages" && unread > 0
        ? `${text} (${unread})`
        : text;
    }

    const label = globals.find((item) => item.slug === slug)?.label;

    return typeof label === "string" ? label : slug;
  };

  const canSee = ({ type, slug }: NavItem) =>
    Boolean(visibleEntities?.[type]?.includes(slug as never)) &&
    Boolean(permissions?.[type]?.[slug]?.read);

  const groups: NavGroupType[] = NAVIGATION.map(({ label, items }) => ({
    label,
    entities: items.filter(canSee).map((item) => ({
      ...item,
      label: labelOf(item),
    })),
  })).filter((group) => group.entities.length > 0);

  return (
    <NavWrapper baseClass={BASE_CLASS}>
      <nav className={`${BASE_CLASS}__wrap`}>
        <Link
          className="lit-nav-enseigne"
          href={formatAdminURL({ adminRoute: routes.admin, path: "" })}
        >
          <Heron />
          <span>
            L&apos;Instant Tranquille
            <small>Espace de gestion</small>
          </span>
        </Link>
        <NavHome
          href={formatAdminURL({ adminRoute: routes.admin, path: "" })}
        />
        <DefaultNavClient groups={groups} navPreferences={NAV_PREFERENCES} />
        <a
          className="lit-nav-site"
          href={siteHref}
          target="_blank"
          rel="noopener"
        >
          Voir le site
          <span className="lit-hors-ecran"> (ouvre un nouvel onglet)</span>
        </a>
        <div className={`${BASE_CLASS}__controls`}>
          <Logout />
        </div>
      </nav>
      <div className={`${BASE_CLASS}__header`}>
        <div className={`${BASE_CLASS}__header-content`}>
          <NavHamburger baseClass={BASE_CLASS} />
        </div>
      </div>
    </NavWrapper>
  );
}
