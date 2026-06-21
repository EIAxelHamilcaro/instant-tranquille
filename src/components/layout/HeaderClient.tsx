"use client";

import { Trees } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { OVERLAY_ROUTES } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

type NavItem = {
  label: string;
  url: string;
  isExternal?: boolean | null;
  highlight?: boolean | null;
};

type LogoMedia = {
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export function HeaderClient({
  navItems,
  ctaButton,
  siteName,
  logo,
}: {
  navItems: NavItem[];
  ctaButton: { label: string; url: string } | null;
  siteName: string;
  logo?: LogoMedia | null;
}) {
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const isOverlayRoute = OVERLAY_ROUTES.includes(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:24px;pointer-events:none;";
    document.body.prepend(sentinel);

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, []);

  const overlay = isOverlayRoute && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-out",
        overlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-sand-200 bg-background/85 shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] backdrop-blur supports-[backdrop-filter]:bg-background/75",
      )}
    >
      {overlay && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 via-black/15 to-transparent"
        />
      )}
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          {logo?.url ? (
            <Image
              src={logo.url}
              alt={logo.alt || siteName}
              width={logo.width || 28}
              height={logo.height || 28}
              className="h-7 w-auto"
              priority
            />
          ) : (
            <Trees
              className={cn(
                "h-7 w-7 transition-colors duration-500",
                overlay ? "text-sand-100" : "text-primary-500",
              )}
              aria-hidden="true"
            />
          )}
          <span
            className={cn(
              "font-display text-xl font-semibold tracking-tight transition-colors duration-500",
              overlay ? "text-white" : "text-foreground",
            )}
          >
            {siteName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label={tCommon("mainNav")}
        >
          {navItems.map((item) => {
            const isActive = !item.isExternal && pathname === item.url;
            const base =
              "rounded-md px-3 py-2 font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";
            if (item.isExternal) {
              return (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    base,
                    overlay
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-foreground/75 hover:bg-sand-100 hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.url}
                href={item.url as "/"}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  base,
                  overlay
                    ? isActive
                      ? "font-semibold text-white underline decoration-sand-300 underline-offset-[6px]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    : isActive
                      ? "font-semibold text-primary-600 underline decoration-primary-300 underline-offset-[6px]"
                      : item.highlight
                        ? "bg-primary-50 text-primary-600 hover:bg-primary-100"
                        : "text-foreground/75 hover:bg-sand-100 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LocaleSwitcher overlay={overlay} />
          </div>
          {ctaButton && (
            <Button
              asChild
              className="hidden bg-primary-500 font-sans text-white shadow-sm hover:bg-primary-600 active:scale-[0.98] sm:inline-flex"
            >
              <Link href={ctaButton.url as "/"}>{ctaButton.label}</Link>
            </Button>
          )}
          <MobileNav navItems={navItems} overlay={overlay} />
        </div>
      </div>
    </header>
  );
}
