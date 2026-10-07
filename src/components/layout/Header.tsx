import { getLocale, getTranslations } from "next-intl/server";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Logo } from "@/components/shared/Logo";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { getGlobal } from "@/lib/queries";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const t = await getTranslations("common");
  const settings = await getGlobal(
    "site-settings",
    (await getLocale()) as Locale,
  );

  return (
    <header className="entete">
      <div className="page flex items-center justify-between gap-4">
        <Link href="/" className="enseigne" aria-label={t("siteName")}>
          <Logo name={t("siteName")} entrance="load" />
        </Link>
        <MainNav className="hidden gap-4 lg:flex xl:gap-7" />
        <div className="flex items-center gap-4">
          <LocaleSwitcher className="hidden lg:flex" />
          <BookingButtons
            settings={settings}
            compact
            className="hidden sm:flex"
          />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
