import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPayload } from "@/lib/payload";
import { Container } from "@/components/shared/Container";
import { Separator } from "@/components/ui/separator";
import { LivretTableOfContents } from "@/components/booklet/LivretTableOfContents";
import { ArrivalInstructions } from "@/components/booklet/ArrivalInstructions";
import { HouseRulesSection } from "@/components/booklet/HouseRulesSection";
import { WifiInfo } from "@/components/booklet/WifiInfo";
import { EquipmentGuide } from "@/components/booklet/EquipmentGuide";
import { LocalRecommendationsGrid } from "@/components/booklet/LocalRecommendationsGrid";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import { EmergencyContacts } from "@/components/booklet/EmergencyContacts";
import { CheckInOutInstructions } from "@/components/booklet/CheckInOutInstructions";
import { BookletPageClient } from "@/components/live-preview/BookletPageClient";
import { Trees } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booklet" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

async function getGuide(accessToken: string, locale: string, draft = false) {
  try {
    const payload = await getPayload();
    const result = await payload.find({
      collection: "onboarding-guides",
      where: {
        accessToken: { equals: accessToken },
        isActive: { equals: true },
      },
      locale: locale as "fr" | "en",
      limit: 1,
      depth: 2,
      draft,
    });
    return result.docs[0] || null;
  } catch {
    return null;
  }
}

export default async function BookletPage({
  params,
}: {
  params: Promise<{ locale: string; accessToken: string }>;
}) {
  const { locale, accessToken } = await params;
  setRequestLocale(locale);

  const { isEnabled: isDraft } = await draftMode();

  const guide = await getGuide(accessToken, locale, isDraft);

  if (!guide) {
    notFound();
  }

  const arrivalData = (guide.arrivalInstructions as any) || {};
  const wifiData = (guide.wifiInfo as any) || {};
  const equipmentItems = (guide.equipmentGuide as any[]) || [];
  const emergencyContacts = (guide.emergencyContacts as any[]) || [];
  const recommendations = ((guide.localRecommendations as any[]) || []).map(
    (r: any) =>
      typeof r === "object"
        ? {
            name: r.name || "",
            category: r.category || "",
            description:
              typeof r.description === "string" ? r.description : "",
            address: r.address,
            phone: r.phone,
            website: r.website,
            distanceFromGite: r.distanceFromGite,
          }
        : null,
  ).filter((r): r is NonNullable<typeof r> => r !== null);

  if (isDraft) {
    return (
      <BookletPageClient
        initialData={{
          title: guide.title as string,
          arrivalInstructions: arrivalData,
          houseRules: guide.houseRules,
          wifiInfo: wifiData,
          equipmentGuide: equipmentItems,
          emergencyContacts,
          localRecommendations: guide.localRecommendations as unknown[],
          checkInInstructions: guide.checkInInstructions,
          checkOutInstructions: guide.checkOutInstructions,
        }}
      />
    );
  }

  return (
    <Container className="py-12">
      <div className="mb-10 text-center">
        <Trees className="mx-auto mb-4 h-12 w-12 text-primary-500" />
        <h1 className="font-heading text-4xl font-bold">
          {(guide.title as string) || "Livret d'accueil"}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          L'Instant Tranquille
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <LivretTableOfContents />
          </div>
        </aside>

        <div className="space-y-12">
          <div className="lg:hidden">
            <LivretTableOfContents />
            <Separator className="mt-6" />
          </div>

          <ArrivalInstructions data={arrivalData} />
          <Separator />

          <HouseRulesSection content={guide.houseRules} />
          <Separator />

          <WifiInfo data={wifiData} />
          <Separator />

          <EquipmentGuide items={equipmentItems} />
          <Separator />

          <LocalRecommendationsGrid recommendations={recommendations} />
          <Separator />

          <section id="map" className="scroll-mt-20">
            <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl font-bold">
              Carte des environs
            </h2>
            <ImagePlaceholder
              aspectRatio="16/9"
              icon="map-pin"
              label="Carte interactive"
              className="rounded-xl"
            />
          </section>
          <Separator />

          <EmergencyContacts contacts={emergencyContacts} />
          <Separator />

          <CheckInOutInstructions
            checkIn={guide.checkInInstructions}
            checkOut={guide.checkOutInstructions}
          />
        </div>
      </div>
    </Container>
  );
}
