import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Clock, MapPin } from "lucide-react";

export function AccessInstructions() {
  const t = useTranslations("contact");

  const routes = [
    {
      from: t("fromParis"),
      duration: "2h00",
      distance: "190 km",
      description: "A10 direction Orléans, puis sortie Blois / Sologne",
    },
    {
      from: t("fromTours"),
      duration: "1h15",
      distance: "85 km",
      description: "A85 puis D956 direction Sologne",
    },
    {
      from: t("fromOrleans"),
      duration: "1h00",
      distance: "70 km",
      description: "D2020 direction Lamotte-Beuvron / Romorantin",
    },
  ];

  return (
    <section className="py-20">
      <Container>
        <SectionHeading title={t("accessTitle")} />
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {routes.map((route) => (
            <Card key={route.from} className="border-sand-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary-500" />
                  <h3 className="font-heading text-lg font-semibold">
                    {route.from}
                  </h3>
                </div>
                <div className="mb-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {route.duration}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {route.distance}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">
                  {route.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
