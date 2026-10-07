import type { CollectionConfig, CustomComponent, Field } from "payload";

type ArrayAdmin = NonNullable<Extract<Field, { type: "array" }>["admin"]>;
type RowLabel = NonNullable<ArrayAdmin["components"]>["RowLabel"];
type CollectionField = CollectionConfig["fields"][number];
type CheckboxAdmin = NonNullable<Extract<Field, { type: "checkbox" }>["admin"]>;
type Cell = NonNullable<CheckboxAdmin["components"]>["Cell"];

export const charCount = (max: number) => ({
  afterInput: [
    {
      path: "/components/payload/CharCount",
      clientProps: { max },
    },
  ],
});

export const help = (text: string) => ({
  Label: {
    path: "/components/payload/HelpLabel",
    clientProps: { help: text },
  },
});

export const rowLabel = (
  template: string,
  fallback: string,
  labels: Record<string, string> = {},
): RowLabel => ({
  path: "/components/payload/RowLabel",
  clientProps: { template, fallback, labels },
});

export const note = (name: string, title: string, text: string): Field => ({
  name,
  type: "ui",
  admin: {
    components: {
      Field: {
        path: "/components/payload/Note",
        clientProps: { title, text },
      },
    },
  },
});

export const screenIntro = (where: string, path?: string): CustomComponent => ({
  path: "/components/payload/ScreenIntro",
  clientProps: { where, path },
});

interface CellLabels {
  yes?: string;
  no?: string;
  suffix?: string;
}

export const listCell = (labels: CellLabels): Cell => ({
  path: "/components/payload/ListCell",
  clientProps: { ...labels },
});

export const advanced = (
  fields: CollectionField[],
  position?: "sidebar",
): CollectionField => ({
  type: "collapsible",
  label: "Réglages avancés",
  admin: {
    initCollapsed: true,
    position,
    description:
      "À laisser tel quel dans la plupart des cas. Ouvrez seulement si vous savez ce que vous changez.",
  },
  fields,
});
