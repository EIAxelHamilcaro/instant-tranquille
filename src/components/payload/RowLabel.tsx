"use client";

import { useRowLabel } from "@payloadcms/ui";

interface RowLabelProps {
  template: string;
  fallback: string;
  labels?: Record<string, string>;
}

const TOKEN = /\{(\w+)\}/g;
const SEPARATOR = ", ";
const MAX_LENGTH = 70;

export default function RowLabel({
  template,
  fallback,
  labels = {},
}: RowLabelProps) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();
  const read = (name: string) => {
    const value = data?.[name];
    if (value === undefined || value === null || value === "") return "";

    return labels[String(value)] ?? String(value);
  };

  const label = template
    .split(SEPARATOR)
    .filter((part) =>
      [...part.matchAll(TOKEN)].every(([, name = ""]) => read(name) !== ""),
    )
    .map((part) => part.replace(TOKEN, (_, name: string) => read(name)))
    .join(SEPARATOR);
  if (!label) return `${fallback} ${(rowNumber ?? 0) + 1}`;

  return label.length > MAX_LENGTH
    ? `${label.slice(0, MAX_LENGTH).trimEnd()}…`
    : label;
}
