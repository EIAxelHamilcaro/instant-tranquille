"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type GalleryItem = {
  image?: unknown;
  caption?: string | null;
};

export function PhotoGallery({ gallery }: { gallery: GalleryItem[] }) {
  const t = useTranslations("cottage");

  if (!gallery?.length) return null;

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("galleryTitle")} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {gallery.map((item, i) => {
            const hasImage =
              item.image &&
              typeof item.image === "object" &&
              (item.image as Record<string, unknown>).url;
            if (!hasImage) return null;

            // First image spans 2 cols and 2 rows, last image spans 2 cols
            const span =
              i === 0
                ? "col-span-2 row-span-2"
                : i === gallery.length - 1 && gallery.length > 2
                  ? "col-span-2"
                  : "";

            const key =
              item.caption ??
              (item.image && typeof item.image === "object"
                ? String((item.image as Record<string, unknown>).url ?? i)
                : String(i));

            return (
              <Dialog key={key}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    aria-label={item.caption || t("openImage")}
                    className={cn(
                      "h-auto overflow-hidden rounded-lg p-0 hover:scale-[1.02]",
                      span,
                    )}
                  >
                    <PayloadImage
                      media={
                        item.image as Parameters<
                          typeof PayloadImage
                        >[0]["media"]
                      }
                      size="card"
                      alt={item.caption || t("galleryTitle")}
                      className="h-full w-full object-cover"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
                  <DialogTitle className="sr-only">
                    {item.caption || t("galleryTitle")}
                  </DialogTitle>
                  <PayloadImage
                    media={
                      item.image as Parameters<typeof PayloadImage>[0]["media"]
                    }
                    size="hero"
                    alt={item.caption || t("galleryTitle")}
                    className="rounded-xl"
                  />
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
