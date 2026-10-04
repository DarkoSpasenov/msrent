import "server-only";
import { getDb } from "@/lib/db";

export type SiteSettings = {
  whatsapp: string; // international format without "+", e.g. 41764651412
  phone: string; // as displayed, e.g. 076 465 14 12
  email: string;
  instagram: string; // handle without "@"
  heroImage: string | null; // uploaded file base name
};

export function getSettings(): SiteSettings {
  const rows = getDb().prepare("SELECT key, value FROM settings").all() as { key: string; value: string }[];
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    whatsapp: map.get("whatsapp") ?? "",
    phone: map.get("phone") ?? "",
    email: map.get("email") ?? "",
    instagram: map.get("instagram") ?? "",
    heroImage: map.get("hero_image") ?? null,
  };
}

export function getSetting(key: string): string | null {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string | null) {
  if (value === null) getDb().prepare("DELETE FROM settings WHERE key = ?").run(key);
  else getDb().prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

/** "+41 76 465 14 12" style for tel: links, from the displayed Swiss number. */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("00")) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `tel:+41${digits.slice(1)}`;
  return `tel:${digits}`;
}
