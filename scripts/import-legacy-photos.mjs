// One-time import of the former Wix site's photos into public/photos.
// Runs in the GitHub Action (which has internet access); does nothing once content/legacy-photos.json is gone.
import fs from "node:fs";
import path from "node:path";

const LIST = "content/legacy-photos.json";
if (!fs.existsSync(LIST)) process.exit(0);

const pending = JSON.parse(fs.readFileSync(LIST, "utf8"));
fs.mkdirSync("public/photos", { recursive: true });

for (const [key, url] of Object.entries(pending)) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (res.headers.get("content-type") || "").includes("jpeg") ? "jpg" : "png";
    if (key === "_hero") {
      // Offered in the media library; the owner decides whether to use it as the home image.
      fs.writeFileSync(`public/photos/ancien-site-fond.${ext}`, buf);
    } else {
      const file = `public/photos/${key}-ancien-site.${ext}`;
      fs.writeFileSync(file, buf);
      const jsonPath = path.join("content/vehicles", `${key}.json`);
      if (fs.existsSync(jsonPath)) {
        const v = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        const src = `/photos/${path.basename(file)}`;
        v.photos = Array.isArray(v.photos) ? v.photos : [];
        if (!v.photos.includes(src)) v.photos.push(src);
        fs.writeFileSync(jsonPath, JSON.stringify(v, null, 2) + "\n");
      }
    }
    delete pending[key];
    console.log(`Importée : ${key}`);
  } catch (e) {
    console.warn(`Échec ${key} (${url}) : ${e.message}`);
  }
}

if (Object.keys(pending).length) fs.writeFileSync(LIST, JSON.stringify(pending, null, 2) + "\n");
else fs.rmSync(LIST);
