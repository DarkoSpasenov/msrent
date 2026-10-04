import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import { OG_IMAGE, SITE } from "@/lib/site";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap", weight: ["600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Location de voiture à Yverdon-les-Bains | MS Rent",
    template: "%s | MS Rent",
  },
  description:
    "Location de voitures à Yverdon-les-Bains dès 30 CHF par jour, kilomètres inclus. À la journée, à la semaine ou au mois. Réservation rapide par WhatsApp.",
  applicationName: "MS Rent",
  openGraph: { type: "website", locale: "fr_CH", siteName: "MS Rent", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
