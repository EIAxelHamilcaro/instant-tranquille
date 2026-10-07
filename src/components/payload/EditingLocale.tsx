"use client";

import { useLocale } from "@payloadcms/ui";
import { useEffect } from "react";

export default function EditingLocale() {
  const { code } = useLocale();

  useEffect(() => {
    document.documentElement.dataset.langue = code;
  }, [code]);

  return null;
}
