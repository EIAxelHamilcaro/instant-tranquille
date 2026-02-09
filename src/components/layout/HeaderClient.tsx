"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

type NavItem = {
  label: string;
  url: string;
  isExternal?: boolean | null;
  highlight?: boolean | null;
};

export function HeaderClient({
  navItems,
  ctaButton,
}: {
  navItems: NavItem[];
  ctaButton: { label: string; url: string } | null;
}) {
  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex">
        {navItems.map((item) =>
          item.isExternal ? (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 font-sans text-sm font-medium text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={item.url}
              href={item.url as "/"}
              className="rounded-md px-3 py-2 font-sans text-sm font-medium text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground"
            >
              {item.label}
            </Link>
          ),
        )}
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden lg:block">
          <LocaleSwitcher />
        </div>
        {ctaButton && (
          <Button
            asChild
            className="hidden bg-primary-500 text-white font-sans hover:bg-primary-600 sm:inline-flex"
          >
            <Link href={ctaButton.url as "/"}>{ctaButton.label}</Link>
          </Button>
        )}
        <MobileNav navItems={navItems} />
      </div>
    </>
  );
}
