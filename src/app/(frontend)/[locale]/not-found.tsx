import { getTranslations } from "next-intl/server";
import { Emblem } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");

  return (
    <section className="page section grid justify-items-start gap-6">
      <Emblem className="heron-vif heron-etat" scene="search" />
      <h1 className="affiche">{t("title")}</h1>
      <p className="chapeau">{t("text")}</p>
      <Button asChild size="lg">
        <Link href="/">{t("back")}</Link>
      </Button>
    </section>
  );
}
