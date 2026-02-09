import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Témoignage", plural: "Témoignages" },
  admin: {
    useAsTitle: "guestName",
    group: "Contenu",
    description: "Avis et témoignages des voyageurs",
    defaultColumns: ["guestName", "rating", "status", "featured", "stayDate"],
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  access: {
    create: isPublic,
    read: isPublic,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: revalidateCollection("testimonials"),
  fields: [
    {
      name: "guestName",
      type: "text",
      required: true,
    },
    {
      name: "guestOrigin",
      type: "text",
      localized: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "text",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "stayDate",
      type: "date",
    },
    {
      name: "source",
      type: "select",
      options: [
        { label: "Airbnb", value: "airbnb" },
        { label: "Booking.com", value: "booking" },
        { label: "Google", value: "google" },
        { label: "Direct", value: "direct" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "En attente", value: "pending" },
        { label: "Approuvé", value: "approved" },
        { label: "Rejeté", value: "rejected" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
