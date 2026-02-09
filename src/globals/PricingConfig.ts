import type { GlobalConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateGlobal } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const PricingConfig: GlobalConfig = {
  slug: "pricing-config",
  label: "Tarifs & Réservation",
  hooks: revalidateGlobal("pricing-config"),
  versions: { drafts: true, max: 25 },
  access: {
    read: isPublic,
    update: isAuthenticated,
  },
  admin: {
    livePreview: {
      url: ({ locale }) => previewUrl("/tarifs-reservation", { locale }),
    },
  },
  fields: [
    {
      name: "currency",
      type: "text",
      defaultValue: "EUR",
    },
    {
      name: "seasons",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        {
          name: "dateRange",
          type: "group",
          fields: [
            { name: "start", type: "text", required: true },
            { name: "end", type: "text", required: true },
          ],
        },
        { name: "nightlyRate", type: "number" },
        { name: "weeklyRate", type: "number" },
        { name: "minimumStay", type: "number", defaultValue: 2 },
        {
          name: "color",
          type: "select",
          options: [
            { label: "Vert (Basse saison)", value: "green" },
            { label: "Orange (Moyenne saison)", value: "orange" },
            { label: "Rouge (Haute saison)", value: "red" },
            { label: "Violet (Très haute saison)", value: "purple" },
          ],
        },
      ],
    },
    {
      name: "additionalFees",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        { name: "amount", type: "number" },
        {
          name: "type",
          type: "select",
          options: [
            { label: "Par séjour", value: "per_stay" },
            { label: "Par nuit", value: "per_night" },
            { label: "Par personne", value: "per_person" },
          ],
        },
        { name: "description", type: "text", localized: true },
      ],
    },
    {
      name: "bookingLinks",
      type: "group",
      fields: [
        { name: "airbnb", type: "text" },
        { name: "booking", type: "text" },
        { name: "email", type: "email" },
      ],
    },
    {
      name: "policies",
      type: "group",
      fields: [
        { name: "cancellation", type: "richText", localized: true },
        { name: "deposit", type: "richText", localized: true },
        { name: "checkIn", type: "text", localized: true },
        { name: "checkOut", type: "text", localized: true },
        { name: "additional", type: "richText", localized: true },
      ],
    },
  ],
};
