"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
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
import { Trees } from "lucide-react";

export type BookletPageData = {
  title?: string;
  arrivalInstructions?: Record<string, unknown>;
  houseRules?: unknown;
  wifiInfo?: Record<string, unknown>;
  equipmentGuide?: unknown[];
  emergencyContacts?: unknown[];
  localRecommendations?: unknown[];
  checkInInstructions?: unknown;
  checkOutInstructions?: unknown;
};

export function BookletPageClient({
  initialData,
}: {
  initialData: BookletPageData;
}) {
  const { data } = useLivePreview<BookletPageData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
    depth: 2,
  });

  const arrivalData = (data.arrivalInstructions as Record<string, unknown>) || {};
  const wifiData = (data.wifiInfo as Record<string, unknown>) || {};
  const equipmentItems = ((data.equipmentGuide as unknown[]) || []) as Array<{
    name: string;
    instructions?: unknown;
    photo?: unknown;
  }>;
  const emergencyContacts = ((data.emergencyContacts as unknown[]) || []) as Array<{
    name: string;
    role?: string;
    phone: string;
    available?: string;
  }>;
  const recommendations = ((data.localRecommendations as unknown[]) || [])
    .map((r: unknown) => {
      const rec = r as Record<string, unknown>;
      return typeof rec === "object" && rec !== null
        ? {
            name: (rec.name as string) || "",
            category: (rec.category as string) || "",
            description:
              typeof rec.description === "string" ? rec.description : "",
            address: rec.address as string | undefined,
            phone: rec.phone as string | undefined,
            website: rec.website as string | undefined,
            distanceFromGite: rec.distanceFromGite as string | undefined,
          }
        : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <Container className="py-12">
      <div className="mb-10 text-center">
        <Trees className="mx-auto mb-4 h-12 w-12 text-primary-500" />
        <h1 className="font-heading text-4xl font-bold">
          {data.title || "Livret d'accueil"}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          L&apos;Instant Tranquille
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

          <HouseRulesSection content={data.houseRules} />
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
            checkIn={data.checkInInstructions}
            checkOut={data.checkOutInstructions}
          />
        </div>
      </div>
    </Container>
  );
}
