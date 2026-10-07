"use client";

import { useRowLabel } from "@payloadcms/ui";

interface RowLabelProps {
  template: string;
  fallback: string;
}

const TOKEN = /\{(\w+)\}/g;
const MAX_LENGTH = 70;

export default function RowLabel({ template, fallback }: RowLabelProps) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();
  const [first = ""] = [...template.matchAll(TOKEN)].map((match) => match[1]);
  const main = data?.[first];
  if (main === undefined || main === null || main === "")
    return `${fallback} ${(rowNumber ?? 0) + 1}`;

  const label = template
    .replace(TOKEN, (_, name: string) => String(data?.[name] ?? ""))
    .replace(/[\s,]+$/, "");

  return label.length > MAX_LENGTH
    ? `${label.slice(0, MAX_LENGTH).trimEnd()}…`
    : label;
}
