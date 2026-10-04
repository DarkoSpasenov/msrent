import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageManifest } from "@/lib/vehicles";

export type SiteSettings = {
  whatsapp: string; // international format without "+", e.g. 41764651412
  phone: string; // as displayed, e.g. 076 465 14 12
  email: string;
  instagram: string; // handle without "@"
  heroImage: string | null; // optimized image base name
};

function whatsappDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = `41${d.slice(1)}`;
  return d;
}

export function getSettings(): SiteSettings {
  const d = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "site.json"), "utf8"));
  const hero = typeof d.heroImage === "string" && d.heroImage ? imageManifest()[d.heroImage.startsWith("/") ? d.heroImage : `/${d.heroImage}`] : undefined;
  return {
    whatsapp: whatsappDigits(String(d.whatsapp ?? "")),
    phone: String(d.phone ?? "").trim(),
    email: String(d.email ?? "").trim(),
    instagram: String(d.instagram ?? "").trim().replace(/^@/, ""),
    heroImage: hero?.file ?? null,
  };
}

/** tel: link in international format from the displayed Swiss number. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("00")) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `tel:+41${digits.slice(1)}`;
  return `tel:${digits}`;
}
