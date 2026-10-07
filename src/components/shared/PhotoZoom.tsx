"use client";

import { ZoomIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import {
  usePhotoViewer,
  type ViewerEntry,
} from "@/components/shared/PhotoViewer";
import type { ViewerPhoto } from "@/components/shared/viewer-photos";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PhotoZoomProps {
  photo: ViewerPhoto;
  corner?: boolean;
}

export function PhotoZoom({ photo, corner = false }: PhotoZoomProps) {
  const t = useTranslations("common.viewer");
  const viewer = usePhotoViewer();
  const button = useRef<HTMLButtonElement>(null);
  const entry = useRef<ViewerEntry | undefined>(undefined);

  useEffect(() => {
    const trigger = button.current;
    const frame = trigger?.parentElement;
    if (!viewer || !trigger || !frame) return;

    const registered = { photo, frame, trigger };
    entry.current = registered;

    return viewer.register(registered);
  }, [viewer, photo]);

  if (!viewer) return null;

  return (
    <Button
      ref={button}
      variant="ghost"
      className={cn("agrandir", corner && "agrandir-coin")}
      aria-label={
        photo.alt ? t("enlargeNamed", { alt: photo.alt }) : t("enlarge")
      }
      onClick={() => {
        if (entry.current) viewer.open(entry.current);
      }}
    >
      {corner && <ZoomIn aria-hidden="true" />}
    </Button>
  );
}
