import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Card, CardContent } from "@/components/ui/card";
import { Trees, Home, MapPin, Moon } from "lucide-react";

const highlights = [
  { icon: Trees, titleKey: "highlightNature", descKey: "highlightNatureDesc" },
  { icon: Home, titleKey: "highlightComfort", descKey: "highlightComfortDesc" },
  {
    icon: MapPin,
    titleKey: "highlightLocation",
    descKey: "highlightLocationDesc",
  },
  { icon: Moon, titleKey: "highlightCalm", descKey: "highlightCalmDesc" },
] as const;

export function HighlightsSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("highlightsTitle")} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map(({ icon: Icon, titleKey, descKey }) => (
            <Card
              key={titleKey}
              className="border-sand-200 bg-white transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
                  <Icon className="h-7 w-7 text-primary-500" />
                </div>
                <h3 className="font-heading text-lg font-semibold">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
