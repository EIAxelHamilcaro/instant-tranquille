"use client";

import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background">
        <nav className="mt-8 flex flex-col gap-4">
          {navItems.map((item) =>
            item.isExternal ? (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 font-sans text-lg font-medium text-foreground transition-colors hover:bg-sand-100"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.url}
                href={item.url as "/"}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2 font-sans text-lg font-medium text-foreground transition-colors hover:bg-sand-100"
              >
                {item.label}
              </Link>
            ),
          )}
          <div className="mt-4 border-t border-sand-200 pt-4">
            <LocaleSwitcher />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
