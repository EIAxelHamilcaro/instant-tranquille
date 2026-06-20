import { Inter, Lora, Playfair_Display } from "next/font/google";

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});
