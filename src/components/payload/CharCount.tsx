"use client";

import { useFormFields } from "@payloadcms/ui";

interface CharCountProps {
  path: string;
  max: number;
}

const NEAR_LIMIT = 0.9;

export default function CharCount({ path, max }: CharCountProps) {
  const value = useFormFields(([fields]) => fields[path]?.value);
  const length = typeof value === "string" ? value.length : 0;
  const state =
    length > max ? "depasse" : length >= max * NEAR_LIMIT ? "proche" : "ok";

  return (
    <p className="lit-compteur" data-etat={state} aria-live="polite">
      {length > max
        ? `${length - max} caractères en trop (${max} au plus)`
        : `${length} sur ${max} caractères`}
    </p>
  );
}
