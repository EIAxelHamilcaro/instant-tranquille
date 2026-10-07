import type { CollectionConfig } from "payload";
import { isAuthenticated } from "@/lib/access";
import { advanced, help, listCell, screenIntro } from "@/lib/admin-fields";
import { previewUrl } from "@/lib/preview-url";
import { revalidateCollection } from "@/lib/revalidate";
import { REVIEW_TOPIC_OPTIONS } from "@/lib/review-topics";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  lockDocuments: false,
  trash: true,
  disableDuplicate: true,
  labels: { singular: "Avis", plural: "Avis des voyageurs" },
  hooks: revalidateCollection("testimonials"),
  defaultSort: "-createdAt",
  admin: {
    useAsTitle: "guestName",
    group: "Avis et réservations",
    description:
      "Recopiez ici un avis reçu sur Airbnb ou Booking, puis passez-le en « Approuvé » pour qu'il apparaisse.",
    defaultColumns: ["guestName", "source", "status", "featured", "topics"],
    listSearchableFields: ["guestName", "text"],
    hideAPIURL: true,
    components: {
      Description: screenIntro(
        "Les avis approuvés défilent sur l'accueil, puis sur « Le gîte », « Tarifs » et « Contact ».",
        "/",
      ),
    },
    livePreview: {
      url: ({ locale }) => previewUrl("/", { locale }),
    },
  },
  access: {
    create: isAuthenticated,
    read: ({ req: { user } }) =>
      user ? true : { status: { equals: "approved" } },
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "guestName",
          type: "text",
          label: "Prénom du voyageur",
          required: true,
          minLength: 2,
          maxLength: 60,
          admin: {
            description: "Tel qu'il apparaît sur la plateforme.",
            placeholder: "Sophie",
            width: "50%",
          },
        },
        {
          name: "source",
          type: "select",
          label: "Plateforme d'origine",
          options: [
            { label: "Airbnb", value: "airbnb" },
            { label: "Booking.com", value: "booking" },
            { label: "Google", value: "google" },
            { label: "Reçu en direct", value: "direct" },
          ],
          admin: {
            description: "Affichée sous l'avis.",
            width: "50%",
          },
        },
      ],
    },
    {
      name: "text",
      type: "textarea",
      label: "Texte de l'avis",
      required: true,
      localized: true,
      minLength: 10,
      maxLength: 2000,
      admin: {
        description:
          "Recopiez l'avis tel quel, dans sa langue d'origine, sans le corriger.",
        rows: 6,
      },
    },
    {
      name: "rating",
      type: "number",
      label: "Note sur 5",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
      validate: (value: number | null | undefined) =>
        value == null || Number.isInteger(value)
          ? true
          : "Donnez une note entière, de 1 à 5.",
      admin: {
        description: "De 1 à 5. Pour Booking, divisez la note par deux.",
        placeholder: "5",
        components: help(
          "Booking note sur 10 et le site sur 5. Un 9 sur Booking devient donc 4,5 : arrondissez à 5. Un 8 devient 4.",
        ),
      },
    },
    advanced([
      {
        name: "language",
        type: "select",
        label: "Langue de l'avis",
        defaultValue: "fr",
        options: [
          { label: "Français", value: "fr" },
          { label: "Anglais", value: "en" },
          { label: "Néerlandais", value: "nl" },
          { label: "Allemand", value: "de" },
          { label: "Espagnol", value: "es" },
        ],
        admin: {
          description:
            "La langue dans laquelle l'avis est écrit. Elle sert aux lecteurs d'écran pour le prononcer correctement.",
        },
      },
      {
        name: "stayDate",
        type: "date",
        label: "Date du séjour",
        admin: {
          description:
            "Le mois du séjour, si vous le connaissez. Transmis à Google avec l'avis.",
          date: { pickerAppearance: "monthOnly", displayFormat: "MMMM yyyy" },
        },
      },
    ]),
    {
      name: "status",
      type: "select",
      label: "Statut",
      required: true,
      defaultValue: "pending",
      admin: {
        position: "sidebar",
        description: "Seuls les avis « Approuvé » sont visibles sur le site.",
        components: help(
          "En attente : l'avis est enregistré mais caché, le résumé vous le rappelle. Approuvé : il est en ligne. Masqué : il reste ici sans jamais s'afficher.",
        ),
      },
      options: [
        { label: "En attente", value: "pending" },
        { label: "Approuvé", value: "approved" },
        { label: "Masqué", value: "rejected" },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Afficher en premier",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Les avis cochés passent devant les autres, sur toutes les pages.",
        components: { Cell: listCell({ yes: "En premier" }) },
      },
    },
    {
      name: "topics",
      type: "select",
      label: "De quoi parle cet avis",
      hasMany: true,
      options: REVIEW_TOPIC_OPTIONS,
      admin: {
        position: "sidebar",
        description:
          "La maison : repris sur la page « Le gîte ». L'accueil : repris sur la page contact. Le prix : passe en tête sur la page tarifs.",
      },
    },
  ],
};
