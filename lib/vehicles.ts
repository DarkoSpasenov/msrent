import "server-only";
import fs from "node:fs";
import path from "node:path";

// Content is edited with Pages CMS (see .pages.yml) and read at build time.
const VEHICLES_DIR = path.join(process.cwd(), "content", "vehicles");
const MANIFEST = path.join(process.cwd(), ".generated", "images.json");

export type Transmission = "manual" | "automatic";

export type Photo = { id: number; file: string; width: number; height: number; transparent: boolean };

export type Vehicle = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  transmission: Transmission;
  seats: number;
  doors: number;
  priceDay: number | null;
  kmDay: number | null;
  priceWeek: number | null;
  kmWeek: number | null;
  priceMonth: number | null;
  kmMonth: number | null;
  description: string;
  available: boolean;
  order: number;
  updatedAt: Date;
  photos: Photo[];
};

type ImageInfo = { file: string; width: number; height: number; transparent: boolean };

export function imageManifest(): Record<string, ImageInfo> {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  } catch {
    return {};
  }
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function load(): Vehicle[] {
  if (!fs.existsSync(VEHICLES_DIR)) return [];
  const images = imageManifest();
  return fs
    .readdirSync(VEHICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f, i) => {
      const full = path.join(VEHICLES_DIR, f);
      const d = JSON.parse(fs.readFileSync(full, "utf8"));
      const photoPaths: string[] = (Array.isArray(d.photos) ? d.photos : [d.photos]).filter((p: unknown) => typeof p === "string" && p);
      const photos = photoPaths
        .map((p) => images[p.startsWith("/") ? p : `/${p}`])
        .filter(Boolean)
        .map((info, id) => ({ id, ...info }));
      return {
        id: i,
        slug: f.replace(/\.json$/, ""),
        brand: String(d.brand ?? "").trim(),
        model: String(d.model ?? "").trim(),
        transmission: d.transmission === "automatic" ? "automatic" : "manual",
        seats: num(d.seats) ?? 0,
        doors: num(d.doors) ?? 0,
        priceDay: num(d.priceDay),
        kmDay: num(d.kmDay),
        priceWeek: num(d.priceWeek),
        kmWeek: num(d.kmWeek),
        priceMonth: num(d.priceMonth),
        kmMonth: num(d.kmMonth),
        description: String(d.description ?? "").trim(),
        available: d.available !== false,
        order: num(d.order) ?? 999,
        updatedAt: fs.statSync(full).mtime,
        photos,
      } satisfies Vehicle;
    })
    .filter((v) => v.brand || v.model);
}

/** Available cars first, then the owner's order. */
export function listVehicles(): Vehicle[] {
  return load().sort((a, b) => Number(b.available) - Number(a.available) || a.order - b.order || a.slug.localeCompare(b.slug));
}

export function getVehicleBySlug(slug: string): Vehicle | null {
  return load().find((v) => v.slug === slug) ?? null;
}

export function vehicleName(v: Pick<Vehicle, "brand" | "model">) {
  return `${v.brand} ${v.model}`.trim();
}
