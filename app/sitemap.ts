import type { MetadataRoute } from "next";
import { photoSrc } from "@/lib/photo";
import { SITE } from "@/lib/site";
import { listVehicles } from "@/lib/vehicles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const vehicles = listVehicles();
  return [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/voitures/`, changeFrequency: "weekly", priority: 0.9 },
    ...vehicles.map((v) => ({
      url: `${SITE.url}/voitures/${v.slug}/`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: v.photos.slice(0, 5).map((p) => `${SITE.origin}${photoSrc(p.file, 1600)}`),
    })),
    { url: `${SITE.url}/mentions-legales/`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/confidentialite/`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
