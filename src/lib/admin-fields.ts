import type { Field } from "payload";

type ArrayAdmin = NonNullable<Extract<Field, { type: "array" }>["admin"]>;
type RowLabel = NonNullable<ArrayAdmin["components"]>["RowLabel"];

export const charCount = (max: number) => ({
  afterInput: [
    {
      path: "/components/payload/CharCount",
      clientProps: { max },
    },
  ],
});

export const rowLabel = (template: string, fallback: string): RowLabel => ({
  path: "/components/payload/RowLabel",
  clientProps: { template, fallback },
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
