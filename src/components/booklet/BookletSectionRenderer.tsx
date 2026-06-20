"use client";

import { normalizeRecommendations } from "@/lib/booklet-utils";
import type { BookletSection } from "@/types/booklet";
import { ArrivalInstructions } from "./ArrivalInstructions";
import { CheckInOutInstructions } from "./CheckInOutInstructions";
import { CustomSection } from "./CustomSection";
import { EmergencyContacts } from "./EmergencyContacts";
import { EquipmentGuide } from "./EquipmentGuide";
import { HouseRulesSection } from "./HouseRulesSection";
import { LocalRecommendationsGrid } from "./LocalRecommendationsGrid";
import { MapSection } from "./MapSection";
import { WifiInfo } from "./WifiInfo";

export function BookletSectionRenderer({
  section,
}: {
  section: BookletSection;
}) {
  switch (section.blockType) {
    case "arrival":
      return (
        <ArrivalInstructions
          id={section.id}
          sectionTitle={section.sectionTitle}
          data={{
            accessCode: section.accessCode,
            instructions: section.instructions,
            parkingInfo: section.parkingInfo,
          }}
        />
      );
    case "wifi":
      return (
        <WifiInfo
          id={section.id}
          sectionTitle={section.sectionTitle}
          data={{
            networkName: section.networkName,
            password: section.password,
          }}
        />
      );
    case "houseRules":
      return (
        <HouseRulesSection
          id={section.id}
          sectionTitle={section.sectionTitle}
          content={section.content}
        />
      );
    case "equipment":
      return (
        <EquipmentGuide
          id={section.id}
          sectionTitle={section.sectionTitle}
          items={section.items ?? []}
        />
      );
    case "emergency":
      return (
        <EmergencyContacts
          id={section.id}
          sectionTitle={section.sectionTitle}
          emergencyLabel={section.emergencyLabel}
          contacts={section.contacts ?? []}
        />
      );
    case "recommendations":
      return (
        <LocalRecommendationsGrid
          id={section.id}
          sectionTitle={section.sectionTitle}
          recommendations={normalizeRecommendations(section.items)}
        />
      );
    case "checkInOut":
      return (
        <CheckInOutInstructions
          id={section.id}
          sectionTitle={section.sectionTitle}
          checkInTime={section.checkInTime}
          checkIn={section.checkInInstructions}
          checkOutTime={section.checkOutTime}
          checkOut={section.checkOutInstructions}
        />
      );
    case "map":
      return (
        <MapSection
          id={section.id}
          sectionTitle={section.sectionTitle}
          embedUrl={section.embedUrl}
          address={section.address}
        />
      );
    case "custom":
      return (
        <CustomSection
          id={section.id}
          title={section.title}
          content={section.content}
        />
      );
    default:
      return null;
  }
}
