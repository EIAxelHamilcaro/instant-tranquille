"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import type { CmsAmenity, CmsRecommendation } from "@/lib/queries";
import { DescriptionSection } from "@/components/cottage/DescriptionSection";
import { PhotoGallery } from "@/components/cottage/PhotoGallery";
import { AmenitiesList } from "@/components/cottage/AmenitiesList";
import { NearbyAttractions } from "@/components/cottage/NearbyAttractions";
import { LeafDivider } from "@/components/shared/LeafDivider";

export type CottagePageData = {
  propertyDetails?: {
    maxGuests?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
  };
  descriptionTitle?: string | null;
  descriptionText?: unknown;
  previewImages?: { image?: unknown; label?: string | null }[] | null;
  gallery: { image?: any; caption?: string | null }[];
  amenities: CmsAmenity[];
  recommendations: CmsRecommendation[];
};

export function CottagePageClient({
  initialData,
}: {
  initialData: CottagePageData;
}) {
  const { data } = useLivePreview<CottagePageData>({
    initialData,
    serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
    depth: 2,
  });

  return (
    <>
      <DescriptionSection
        propertyDetails={data.propertyDetails}
        descriptionTitle={data.descriptionTitle}
        descriptionText={data.descriptionText}
        previewImages={data.previewImages}
      />
      <PhotoGallery gallery={data.gallery} />
      <LeafDivider />
      <AmenitiesList amenities={data.amenities} />
      <NearbyAttractions recommendations={data.recommendations} />
    </>
  );
}
