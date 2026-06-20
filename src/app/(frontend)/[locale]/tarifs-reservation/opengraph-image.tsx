import { OG_SIZE, renderOGTemplate } from "@/lib/og";

export const runtime = "edge";
export const alt = "Tarifs & Réservation, L'Instant Tranquille en Sologne";
export const size = OG_SIZE;
export const contentType = "image/png";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function OGImage() {
  const imageSrc = `${SITE_URL}/images/sejour-canape-buffet-escalier.webp`;

  return renderOGTemplate({
    title: "Tarifs & Réservation",
    subtitle: "Réservez votre séjour en Sologne sur Airbnb ou Booking.",
    imageSrc,
    tags: ["Airbnb", "Booking", "Sologne"],
  });
}
