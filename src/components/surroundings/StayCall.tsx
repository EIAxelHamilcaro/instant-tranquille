import { getTranslations } from "next-intl/server";
import { BookingButtons } from "@/components/shared/BookingButtons";
import { Link } from "@/i18n/navigation";
import type { SiteSetting } from "@/payload-types";

interface StayCallProps {
  settings: SiteSetting;
  text: string;
}

export async function StayCall({ settings, text }: StayCallProps) {
  const t = await getTranslations("surroundings");

  return (
    <section className="appel section section-claire">
      <div className="page grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <h2 className="lg:col-span-6">{t("stay.title")}</h2>
        <div className="grid content-start gap-6 lg:col-span-6">
          <p className="chapeau">{text}</p>
          <BookingButtons settings={settings} />
          <p className="ui flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/tarifs-reservation" className="lien">
              {t("stay.rates")}
            </Link>
            <Link href="/le-gite" className="lien">
              {t("stay.house")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
