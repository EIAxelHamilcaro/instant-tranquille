"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { BookletLayout } from "@/components/booklet/BookletLayout";
import type { BookletGuideData } from "@/types/booklet";

export function BookletPageClient({
  initialData,
  siteName = "L'Instant Tranquille",
}: {
  initialData: BookletGuideData;
  siteName?: string;
}) {
  const { data } = useLivePreview<BookletGuideData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
    depth: 2,
  });

  return (
    <BookletLayout
      title={data.title}
      siteName={siteName}
      sections={data.sections ?? []}
    />
  );
}
