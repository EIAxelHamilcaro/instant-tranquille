"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import { PricingTable } from "@/components/rates/PricingTable";
import { BookingLinks } from "@/components/rates/BookingLinks";
import { PoliciesSection } from "@/components/rates/PoliciesSection";

type Season = {
  name: string;
  dateRange?: { start: string; end: string } | null;
  nightlyRate?: number | null;
  weeklyRate?: number | null;
  minimumStay?: number | null;
  color?: string | null;
};

type AdditionalFee = {
  name: string;
  amount?: number | null;
  type?: string | null;
  description?: string | null;
};

type BookingLinksData = {
  airbnb?: string | null;
  booking?: string | null;
  email?: string | null;
};

type Policies = {
  cancellation?: unknown;
  deposit?: unknown;
  checkIn?: string | null;
  checkOut?: string | null;
  additional?: unknown;
};

export type RatesPageData = {
  seasons: Season[];
  additionalFees: AdditionalFee[];
  currency: string;
  bookingLinks?: BookingLinksData | null;
  policies?: Policies | null;
};

export function RatesPageClient({
  initialData,
}: {
  initialData: RatesPageData;
}) {
  const { data } = useLivePreview<RatesPageData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
    depth: 2,
  });

  return (
    <>
      <PricingTable
        seasons={data.seasons || []}
        additionalFees={data.additionalFees || []}
        currency={data.currency || "EUR"}
      />
      <BookingLinks bookingLinks={data.bookingLinks} />
      <PoliciesSection policies={data.policies} />
    </>
  );
}
