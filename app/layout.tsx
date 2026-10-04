import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Location de voiture à Yverdon-les-Bains | MS Rent",
    template: "%s | MS Rent",
  },
  description:
    "Location de voitures à Yverdon-les-Bains dès 30 CHF par jour, kilomètres inclus. À la journée, à la semaine ou au mois. Réservation rapide par WhatsApp.",
  applicationName: "MS Rent",
  openGraph: { type: "website", locale: "fr_CH", siteName: "MS Rent" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${inter.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
