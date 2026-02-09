"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Trees } from "lucide-react";
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
  siteName,
}: {
  navItems: NavItem[];
  ctaButton: { label: string; url: string } | null;
  siteName: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 10) {
        header!.setAttribute("data-scrolled", "");
      } else {
        header!.removeAttribute("data-scrolled");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-sand-200 bg-background/95 backdrop-blur transition-shadow supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
        >
          <Trees className="h-7 w-7 text-primary-500" />
          <span className="font-heading text-xl font-bold text-foreground">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => {
            const isActive = !item.isExternal && pathname === item.url;
            return item.isExternal ? (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md px-3 py-2 font-sans text-sm font-medium text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.url}
                href={item.url as "/"}
                aria-current={isActive ? "page" : undefined}
                className="rounded-md px-3 py-2 font-sans text-sm font-medium text-foreground/80 transition-colors hover:bg-sand-100 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            );
          })}
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
      </div>
    </header>
  );
}
