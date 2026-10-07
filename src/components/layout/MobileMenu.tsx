"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MainNav } from "./MainNav";

export function MobileMenu() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={t("openMenu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="enseigne">
            <Logo name={t("siteName")} />
          </SheetTitle>
        </SheetHeader>
        <MainNav
          className="grid justify-items-start gap-3"
          onNavigate={() => setOpen(false)}
        />
        <LocaleSwitcher className="gap-5" />
      </SheetContent>
    </Sheet>
  );
}
