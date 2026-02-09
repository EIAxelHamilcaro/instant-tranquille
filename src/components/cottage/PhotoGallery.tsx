"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { PayloadImage } from "@/components/shared/PayloadImage";
import { ImagePlaceholder } from "@/components/shared/ImagePlaceholder";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

const defaultGalleryItems = [
  { icon: "home", label: "Façade du gîte", span: "col-span-2 row-span-2" },
  { icon: "bed", label: "Chambre principale", span: "" },
  { icon: "utensils", label: "Cuisine équipée", span: "" },
  { icon: "bed", label: "Chambre enfants", span: "" },
  { icon: "trees", label: "Jardin", span: "col-span-2" },
  { icon: "home", label: "Salon", span: "" },
  { icon: "image", label: "Salle de bain", span: "" },
  { icon: "trees", label: "Terrasse", span: "col-span-2" },
] as const;

export function PhotoGallery({ images }: { images?: any[] }) {
  const t = useTranslations("cottage");

  return (
    <section className="bg-sand-100 py-20">
      <Container>
        <SectionHeading title={t("galleryTitle")} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {defaultGalleryItems.map((item, i) => {
            const cmsImage = images?.[i];
            const hasCmsImage = cmsImage && typeof cmsImage === "object" && cmsImage.url;

            return (
              <Dialog key={i}>
                <DialogTrigger asChild>
                  <button
                    className={`overflow-hidden rounded-lg transition-transform hover:scale-[1.02] ${item.span}`}
                  >
                    {hasCmsImage ? (
                      <PayloadImage
                        media={cmsImage}
                        size="card"
                        alt={item.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholder
                        aspectRatio={
                          item.span.includes("row-span-2") ? "1" : "4/3"
                        }
                        icon={item.icon}
                        label={item.label}
                        className="h-full w-full"
                      />
                    )}
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
                  <DialogTitle className="sr-only">{item.label}</DialogTitle>
                  {hasCmsImage ? (
                    <PayloadImage
                      media={cmsImage}
                      size="hero"
                      alt={item.label}
                      className="rounded-xl"
                    />
                  ) : (
                    <ImagePlaceholder
                      aspectRatio="16/9"
                      icon={item.icon}
                      label={item.label}
                      className="rounded-xl"
                    />
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
