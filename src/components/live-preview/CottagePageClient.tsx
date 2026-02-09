"use client";

import { useLivePreview } from "@payloadcms/live-preview-react";
import type { CmsAmenity, CmsRecommendation } from "@/lib/queries";
import { DescriptionSection } from "@/components/cottage/DescriptionSection";
import { PhotoGallery } from "@/components/cottage/PhotoGallery";
import { AmenitiesList } from "@/components/cottage/AmenitiesList";
import { FloorPlanSection } from "@/components/cottage/FloorPlanSection";
import { NearbyAttractions } from "@/components/cottage/NearbyAttractions";
import { LeafDivider } from "@/components/shared/LeafDivider";

export type CottagePageData = {
  propertyDetails?: {
    maxGuests?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
  };
  images: unknown[];
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
      <DescriptionSection propertyDetails={data.propertyDetails} />
      <PhotoGallery images={data.images} />
      <LeafDivider />
      <AmenitiesList amenities={data.amenities} />
      <FloorPlanSection />
      <NearbyAttractions recommendations={data.recommendations} />
    </>
  );
}
