"use client";

import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { useState } from "react";

type NavItem = {
  label: string;
  url: string;
  isExternal?: boolean | null;
};

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none">
          <Menu className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background">
        <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
        <nav aria-label="Navigation mobile" className="mt-8 flex flex-col gap-4">
          {navItems.map((item, index) => {
            const isActive = !item.isExternal && pathname === item.url;
            return item.isExternal ? (
              <a
                key={`${item.url}-${index}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 font-sans text-lg font-medium text-foreground transition-colors hover:bg-sand-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={`${item.url}-${index}`}
                href={item.url as "/"}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-2 font-sans text-lg font-medium transition-colors hover:bg-sand-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none ${isActive ? "font-bold text-primary-600 underline underline-offset-4" : "text-foreground"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-4 border-t border-sand-200 pt-4">
            <LocaleSwitcher />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
