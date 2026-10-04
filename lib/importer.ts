import "server-only";
import { getDb } from "@/lib/db";
import { processImage } from "@/lib/images";
import { getSetting, setSetting } from "@/lib/settings";
import { addPhoto, clearLegacyPhoto } from "@/lib/vehicles";

export type ImportResult = { imported: number; failed: number; remaining: number };

async function download(url: string): Promise<Buffer> {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { "User-Agent": "Mozilla/5.0 (msrent importer)" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

let running: Promise<ImportResult> | null = null;

/**
 * Copies the photos of the former Wix site into the new site, once.
 * Safe to call repeatedly: finished items are cleared and skipped next time.
 */
export function importLegacyPhotos(): Promise<ImportResult> {
  running ??= run().finally(() => (running = null));
  return running;
}

async function run(): Promise<ImportResult> {
  let imported = 0;
  let failed = 0;
  const pending = getDb()
    .prepare("SELECT id, legacy_photo_url AS url FROM vehicles WHERE legacy_photo_url IS NOT NULL")
    .all() as { id: number; url: string }[];

  for (const { id, url } of pending) {
    try {
      const image = await processImage(await download(url));
      // Appended after any photo the owner already uploaded, so it never replaces their main photo.
      addPhoto(id, image);
      clearLegacyPhoto(id);
      imported++;
    } catch (err) {
      failed++;
      console.warn(`[import] Photo ${url} : ${(err as Error).message}`);
    }
  }

  const heroUrl = getSetting("legacy_hero_url");
  if (heroUrl) {
    try {
      const image = await processImage(await download(heroUrl), "site");
      // Kept as a candidate: the owner decides in Paramètres whether it becomes the home page image.
      setSetting("legacy_hero_image", image.file);
      setSetting("legacy_hero_url", null);
      imported++;
    } catch (err) {
      failed++;
      console.warn(`[import] Image d'accueil : ${(err as Error).message}`);
    }
  }

  return { imported, failed, remaining: pendingLegacyCount() };
}

export function pendingLegacyCount(): number {
  const v = getDb().prepare("SELECT COUNT(*) AS n FROM vehicles WHERE legacy_photo_url IS NOT NULL").get() as { n: number };
  return v.n + (getSetting("legacy_hero_url") ? 1 : 0);
}
