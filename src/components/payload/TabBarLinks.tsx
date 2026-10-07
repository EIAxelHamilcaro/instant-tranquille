"use client";

import { useNav } from "@payloadcms/ui";
import { FileText, Mail, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heron } from "./Heron";

interface TabBarLinksProps {
  adminRoute: string;
  unread: number;
}

const TABS = [
  { path: "", label: "Résumé", Icon: Heron, matches: /^$/ },
  {
    path: "/collections/contact-messages",
    label: "Messages",
    Icon: Mail,
    matches: /^\/collections\/contact-messages/,
  },
  {
    path: "/pages",
    label: "Pages",
    Icon: FileText,
    matches: /^\/(pages|globals\/[\w-]+-page)/,
  },
  {
    path: "/collections/places",
    label: "Lieux",
    Icon: MapPin,
    matches: /^\/collections\/places/,
  },
];

export default function TabBarLinks({ adminRoute, unread }: TabBarLinksProps) {
  const pathname = usePathname();
  const { navOpen, setNavOpen } = useNav();
  const current = pathname.replace(adminRoute, "").replace(/\/$/, "");
  const MenuIcon = navOpen ? X : Menu;

  return (
    <nav className="lit-onglets" aria-label="Raccourcis">
      {TABS.map(({ path, label, Icon, matches }) => (
        <Link
          key={label}
          href={`${adminRoute}${path}`}
          aria-current={!navOpen && matches.test(current) ? "page" : undefined}
          onClick={() => setNavOpen(false)}
        >
          <Icon />
          {label}
          {label === "Messages" && unread > 0 && (
            <span className="lit-pastille">
              {unread}
              <span className="lit-hors-ecran"> à lire</span>
            </span>
          )}
        </Link>
      ))}
      <button
        type="button"
        data-plus
        aria-expanded={navOpen}
        onClick={() => setNavOpen(!navOpen)}
      >
        <MenuIcon />
        {navOpen ? "Fermer" : "Plus"}
      </button>
    </nav>
  );
}
