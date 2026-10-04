import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { UPLOAD_DIR } from "@/lib/db";
import { PHOTO_WIDTHS } from "@/lib/photo";

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

export type ProcessedImage = { file: string; width: number; height: number; transparent: boolean };

/**
 * Turns any uploaded image into resized WebP variants (480, 960, 1600 px wide),
 * corrected for phone orientation and stripped of metadata (GPS etc.).
 */
export async function processImage(input: Buffer, prefix = "p"): Promise<ProcessedImage> {
  const base = sharp(input, { failOn: "error", limitInputPixels: 80_000_000 }).rotate();
  const meta = await base.metadata();
  if (!meta.width || !meta.height) throw new Error("Image illisible");
  const stats = await base.clone().stats();
  const transparent = !!meta.hasAlpha && !stats.isOpaque;

  const file = `${prefix}-${crypto.randomBytes(8).toString("hex")}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  let width = meta.width;
  let height = meta.height;
  // EXIF orientations 5–8 swap the axes.
  if (meta.orientation && meta.orientation >= 5) [width, height] = [height, width];

  for (const w of PHOTO_WIDTHS) {
    await base
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: w >= 1600 ? 78 : 80, alphaQuality: 90, effort: 4 })
      .toFile(path.join(UPLOAD_DIR, `${file}-${w}.webp`));
  }
  const scale = Math.min(1, PHOTO_WIDTHS[PHOTO_WIDTHS.length - 1] / width);
  return { file, width: Math.round(width * scale), height: Math.round(height * scale), transparent };
}

export async function removeImageFiles(file: string) {
  if (!/^[a-z]+-[a-f0-9]{16}$/.test(file)) return;
  await Promise.all(PHOTO_WIDTHS.map((w) => fs.rm(path.join(UPLOAD_DIR, `${file}-${w}.webp`), { force: true })));
}
