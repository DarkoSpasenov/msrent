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

// Cut-out car photos: crop the empty margins, enlarge small ones cleanly, lift colours slightly
// and lay the car on a soft ground shadow so every car looks shot in the same studio.
async function studioCutout(img) {
  const { data, info } = await img.trim({ threshold: 5 }).png().toBuffer({ resolveWithObject: true });
  let car = sharp(data);
  const target = Math.min(1400, Math.max(info.width, info.width * 2));
  if (target > info.width) car = car.resize({ width: target, kernel: "lanczos3" });
  car = car.modulate({ saturation: 1.08 }).linear(1.04, -4).sharpen({ sigma: 0.9, m1: 0.6, m2: 2.5 });
  const carBuf = await car.png().toBuffer();
  const { width: w, height: h } = await sharp(carBuf).metadata();
  // Two shadows: a wide soft one and a tighter, darker one where the tyres touch the ground.
  const padY = Math.round(h * 0.07), padX = Math.round(w * 0.04);
  const W = w + padX * 2, H = h + padY, cy = h - w * 0.02;
  const ellipse = (rx, ry, blur, opacity) =>
    `<filter id="b${blur}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>` +
    `<ellipse cx="${W / 2}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#111214" fill-opacity="${opacity}" filter="url(#b${blur})"/>`;
  const shadow = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      ellipse(w * 0.44, w * 0.035, Math.round(w * 0.02), 0.22) +
      ellipse(w * 0.36, w * 0.014, Math.round(w * 0.008), 0.4) +
      `</svg>`,
  );
  return sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: shadow }, { input: carBuf, top: 0, left: padX }])
    .png()
    .toBuffer();
}

fs.mkdirSync(OUT, { recursive: true });
const files = fs.existsSync(SRC) ? fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|avif|gif|tiff?)$/i.test(f)) : [];

for (const name of files) {
  const input = fs.readFileSync(path.join(SRC, name));
  const hash = crypto.createHash("sha1").update("v4").update(input).digest("hex").slice(0, 10);
  const base = `${path.parse(name).name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo"}-${hash}`;
  try {
    let img = sharp(input, { failOn: "error" }).rotate();
    const meta = await img.metadata();
    const transparent = !!meta.hasAlpha && !(await img.clone().stats()).isOpaque;
    // Cut-out car photos often have wide empty margins: crop them so the car fills its frame.
    if (transparent) img = sharp(await studioCutout(img));
    const { width, height } = await img.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
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
