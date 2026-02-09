import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'Instant Tranquille — Gîte de charme en Sologne",
    short_name: "L'Instant Tranquille",
    description:
      "Gîte de charme au cœur de la Sologne, entre forêts et châteaux de la Loire.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcf9",
    theme_color: "#4a7c59",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
