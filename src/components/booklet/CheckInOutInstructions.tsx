import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { RichTextRenderer } from "@/components/shared/RichTextRenderer";
import { LogIn, LogOut, Clock } from "lucide-react";

export function CheckInOutInstructions({
  checkIn,
  checkOut,
}: {
  checkIn: any;
  checkOut: any;
}) {
  const t = useTranslations("booklet");

  return (
    <section id="checkinout" className="scroll-mt-20">
      <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
        <Clock className="h-6 w-6 text-primary-500" />
        {t("checkInOut")}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary-500" />
              <h3 className="font-heading text-lg font-semibold">
                {t("checkIn")}
              </h3>
            </div>
            {checkIn ? (
              <RichTextRenderer content={checkIn} />
            ) : (
              <p className="text-sm text-foreground/80">
                Arrivée à partir de 16h00. Merci de nous prévenir de votre heure
                d'arrivée estimée.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-earth-200">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <LogOut className="h-5 w-5 text-earth-500" />
              <h3 className="font-heading text-lg font-semibold">
                {t("checkOut")}
              </h3>
            </div>
            {checkOut ? (
              <RichTextRenderer content={checkOut} />
            ) : (
              <p className="text-sm text-foreground/80">
                Départ avant 10h00. Merci de laisser le logement dans l'état où
                vous l'avez trouvé.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
