import type { CollectionConfig } from "payload";
import { isAuthenticated, isPublic } from "@/lib/access";
import { revalidateCollection } from "@/lib/revalidate";
import { previewUrl } from "@/lib/preview-url";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  lockDocuments: false,
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
      label: "Nom du voyageur",
      required: true,
      admin: {
        description: "Prénom et nom de la personne",
        placeholder: "Sophie et Marc Dupont",
      },
    },
    {
      name: "guestOrigin",
      type: "text",
      label: "Provenance",
      localized: true,
      admin: {
        description: "Ville ou pays d'origine",
        placeholder: "Paris, France",
      },
    },
    {
      name: "rating",
      type: "number",
      label: "Note",
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: "Note de 1 à 5 étoiles",
      },
    },
    {
      name: "text",
      type: "textarea",
      label: "Texte du témoignage",
      required: true,
      localized: true,
      admin: {
        description: "L'avis complet du voyageur",
      },
    },
    {
      name: "stayDate",
      type: "date",
      label: "Date du séjour",
      admin: {
        description:
          "Quand ce voyageur a séjourné au gîte",
      },
    },
    {
      name: "source",
      type: "select",
      label: "Plateforme d'origine",
      admin: {
        description: "D'où vient cet avis",
      },
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
      label: "Statut",
      required: true,
      defaultValue: "pending",
      admin: {
        position: "sidebar",
        description:
          "« En attente » = à valider, « Approuvé » = visible sur le site, « Rejeté » = masqué",
      },
      options: [
        { label: "En attente", value: "pending" },
        { label: "Approuvé", value: "approved" },
        { label: "Rejeté", value: "rejected" },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Mettre en avant",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Cochez pour afficher cet avis en priorité sur la page d'accueil",
      },
    },
  ],
};
