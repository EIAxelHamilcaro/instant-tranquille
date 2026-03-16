export type ArrivalSection = {
  id: string;
  blockType: "arrival";
  sectionTitle?: string | null;
  accessCode?: string | null;
  instructions?: unknown;
  parkingInfo?: string | null;
};

export type WifiSection = {
  id: string;
  blockType: "wifi";
  sectionTitle?: string | null;
  networkName?: string | null;
  password?: string | null;
};

export type HouseRulesSection = {
  id: string;
  blockType: "houseRules";
  sectionTitle?: string | null;
  content?: unknown;
};

export type EquipmentSection = {
  id: string;
  blockType: "equipment";
  sectionTitle?: string | null;
  items?: Array<{
    name: string;
    instructions?: unknown;
    photo?: unknown;
  }>;
};

export type EmergencySection = {
  id: string;
  blockType: "emergency";
  sectionTitle?: string | null;
  emergencyNumber?: string | null;
  emergencyLabel?: string | null;
  contacts?: Array<{
    name: string;
    role?: string | null;
    phone: string;
    available?: string | null;
  }>;
};

export type RecommendationsSection = {
  id: string;
  blockType: "recommendations";
  sectionTitle?: string | null;
  items?: unknown[] | null;
};

export type CheckInOutSection = {
  id: string;
  blockType: "checkInOut";
  sectionTitle?: string | null;
  checkInTime?: string | null;
  checkInInstructions?: unknown;
  checkOutTime?: string | null;
  checkOutInstructions?: unknown;
};

export type MapSection = {
  id: string;
  blockType: "map";
  sectionTitle?: string | null;
  embedUrl?: string | null;
  address?: string | null;
};

export type CustomSection = {
  id: string;
  blockType: "custom";
  title: string;
  content?: unknown;
};

export type BookletSection =
  | ArrivalSection
  | WifiSection
  | HouseRulesSection
  | EquipmentSection
  | EmergencySection
  | RecommendationsSection
  | CheckInOutSection
  | MapSection
  | CustomSection;

export type BookletGuideData = {
  title?: string;
  sections?: BookletSection[];
};
