import { cn } from "@/lib/utils";

interface GoogleMapProps {
  lat?: number | null;
  lng?: number | null;
  zoom?: number | null;
  locale?: string;
  title: string;
  className?: string;
}

export function GoogleMap({
  lat,
  lng,
  zoom,
  locale = "fr",
  title,
  className,
}: GoogleMapProps) {
  const latitude = lat ?? 47.360803;
  const longitude = lng ?? 1.7533421;
  const z = zoom ?? 13;
  const src = `https://maps.google.com/maps?q=${latitude},${longitude}&z=${z}&hl=${locale}&output=embed`;

  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className={cn(
        "h-[300px] w-full border-0 sm:h-[380px] md:h-[440px]",
        className,
      )}
    />
  );
}
