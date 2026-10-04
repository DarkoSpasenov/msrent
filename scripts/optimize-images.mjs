// Turns every photo in public/photos into resized WebP variants (480, 960, 1600 px)
// in public/_img, and writes a manifest read by the site at build time.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/photos";
const OUT = "public/_img";
const WIDTHS = [480, 960, 1600];
const manifest = {};

fs.mkdirSync(OUT, { recursive: true });
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(f)) : [];

for (const name of files) {
  const input = fs.readFileSync(path.join(SRC, name));
  const hash = crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
  const base = `${path.parse(name).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo"}-${hash}`;
  try {
    const img = sharp(input, { failOn: "error" }).rotate();
    const meta = await img.metadata();
    let { width, height } = meta;
    if (meta.orientation && meta.orientation >= 5) [width, height] = [height, width];
    const transparent = !!meta.hasAlpha && !(await img.clone().stats()).isOpaque;
    for (const w of WIDTHS) {
      const out = path.join(OUT, `${base}-${w}.webp`);
      if (!fs.existsSync(out)) await img.clone().resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 90 }).toFile(out);
    }
    const scale = Math.min(1, 1600 / width);
    manifest[`/photos/${name}`] = { file: base, width: Math.round(width * scale), height: Math.round(height * scale), transparent };
  } catch (e) {
    console.warn(`Photo ignorée (format non pris en charge) : ${name} — ${e.message}`);
  }
}

fs.mkdirSync(".generated", { recursive: true });
fs.writeFileSync(".generated/images.json", JSON.stringify(manifest, null, 2));
console.log(`${Object.keys(manifest).length} photo(s) optimisée(s).`);
