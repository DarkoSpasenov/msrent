import "server-only";
import { getDb } from "@/lib/db";

export type Transmission = "manual" | "automatic";

export type Photo = {
  id: number;
  file: string;
  width: number;
  height: number;
  transparent: boolean;
  position: number;
};

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
  position: number;
  legacyPhotoUrl: string | null;
  updatedAt: string;
  photos: Photo[];
};

export type VehicleInput = {
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
};

type Row = {
  id: number;
  slug: string;
  brand: string;
  model: string;
  transmission: Transmission;
  seats: number;
  doors: number;
  price_day: number | null;
  km_day: number | null;
  price_week: number | null;
  km_week: number | null;
  price_month: number | null;
  km_month: number | null;
  description: string;
  available: number;
  position: number;
  legacy_photo_url: string | null;
  updated_at: string;
};

type PhotoRow = {
  id: number;
  vehicle_id: number;
  file: string;
  width: number;
  height: number;
  transparent: number;
  position: number;
};

function toPhoto(r: PhotoRow): Photo {
  return { id: r.id, file: r.file, width: r.width, height: r.height, transparent: !!r.transparent, position: r.position };
}

function toVehicle(r: Row, photos: Photo[]): Vehicle {
  return {
    id: r.id,
    slug: r.slug,
    brand: r.brand,
    model: r.model,
    transmission: r.transmission,
    seats: r.seats,
    doors: r.doors,
    priceDay: r.price_day,
    kmDay: r.km_day,
    priceWeek: r.price_week,
    kmWeek: r.km_week,
    priceMonth: r.price_month,
    kmMonth: r.km_month,
    description: r.description,
    available: !!r.available,
    position: r.position,
    legacyPhotoUrl: r.legacy_photo_url,
    updatedAt: r.updated_at,
    photos,
  };
}

function withPhotos(rows: Row[]): Vehicle[] {
  if (!rows.length) return [];
  const ids = rows.map((r) => r.id);
  const photoRows = getDb()
    .prepare(`SELECT * FROM photos WHERE vehicle_id IN (${ids.map(() => "?").join(",")}) ORDER BY position, id`)
    .all(...ids) as PhotoRow[];
  const byVehicle = new Map<number, Photo[]>();
  for (const p of photoRows) {
    const list = byVehicle.get(p.vehicle_id) ?? [];
    list.push(toPhoto(p));
    byVehicle.set(p.vehicle_id, list);
  }
  return rows.map((r) => toVehicle(r, byVehicle.get(r.id) ?? []));
}

/** Public listing: available cars first, then the owner's order. */
export function listVehicles(): Vehicle[] {
  const rows = getDb().prepare("SELECT * FROM vehicles ORDER BY available DESC, position, id").all() as Row[];
  return withPhotos(rows);
}

export function listVehiclesAdmin(): Vehicle[] {
  const rows = getDb().prepare("SELECT * FROM vehicles ORDER BY position, id").all() as Row[];
  return withPhotos(rows);
}

export function getVehicleBySlug(slug: string): Vehicle | null {
  const row = getDb().prepare("SELECT * FROM vehicles WHERE slug = ?").get(slug) as Row | undefined;
  return row ? withPhotos([row])[0] : null;
}

export function getVehicle(id: number): Vehicle | null {
  const row = getDb().prepare("SELECT * FROM vehicles WHERE id = ?").get(id) as Row | undefined;
  return row ? withPhotos([row])[0] : null;
}

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "vehicule";
}

function uniqueSlug(base: string, exceptId?: number): string {
  const db = getDb();
  let slug = base;
  for (let i = 2; ; i++) {
    const hit = db.prepare("SELECT id FROM vehicles WHERE slug = ?").get(slug) as { id: number } | undefined;
    if (!hit || hit.id === exceptId) return slug;
    slug = `${base}-${i}`;
  }
}

function params(input: VehicleInput) {
  return {
    brand: input.brand,
    model: input.model,
    transmission: input.transmission,
    seats: input.seats,
    doors: input.doors,
    price_day: input.priceDay,
    km_day: input.kmDay,
    price_week: input.priceWeek,
    km_week: input.kmWeek,
    price_month: input.priceMonth,
    km_month: input.kmMonth,
    description: input.description,
    available: input.available ? 1 : 0,
  };
}

export function createVehicle(input: VehicleInput): Vehicle {
  const db = getDb();
  const slug = uniqueSlug(slugify(`${input.brand} ${input.model}`));
  const max = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM vehicles").get() as { m: number };
  const info = db
    .prepare(
      `INSERT INTO vehicles (slug, brand, model, transmission, seats, doors, price_day, km_day, price_week, km_week, price_month, km_month, description, available, position)
       VALUES (@slug, @brand, @model, @transmission, @seats, @doors, @price_day, @km_day, @price_week, @km_week, @price_month, @km_month, @description, @available, @position)`,
    )
    .run({ ...params(input), slug, position: max.m + 1 });
  return getVehicle(Number(info.lastInsertRowid))!;
}

/** Keeps the URL stable unless brand or model changed. */
export function updateVehicle(id: number, input: VehicleInput): Vehicle | null {
  const current = getVehicle(id);
  if (!current) return null;
  const nameChanged = current.brand !== input.brand || current.model !== input.model;
  const slug = nameChanged ? uniqueSlug(slugify(`${input.brand} ${input.model}`), id) : current.slug;
  getDb()
    .prepare(
      `UPDATE vehicles SET slug=@slug, brand=@brand, model=@model, transmission=@transmission, seats=@seats, doors=@doors,
       price_day=@price_day, km_day=@km_day, price_week=@price_week, km_week=@km_week, price_month=@price_month, km_month=@km_month,
       description=@description, available=@available, updated_at=datetime('now') WHERE id=@id`,
    )
    .run({ ...params(input), slug, id });
  return getVehicle(id);
}

export function setAvailability(id: number, available: boolean) {
  getDb().prepare("UPDATE vehicles SET available = ?, updated_at = datetime('now') WHERE id = ?").run(available ? 1 : 0, id);
}

/** Returns the photo files so the caller can remove them from disk. */
export function deleteVehicle(id: number): string[] {
  const db = getDb();
  const files = (db.prepare("SELECT file FROM photos WHERE vehicle_id = ?").all(id) as { file: string }[]).map((r) => r.file);
  db.prepare("DELETE FROM vehicles WHERE id = ?").run(id);
  return files;
}

export function moveVehicle(id: number, direction: -1 | 1) {
  const db = getDb();
  const ids = (db.prepare("SELECT id FROM vehicles ORDER BY position, id").all() as { id: number }[]).map((r) => r.id);
  const i = ids.indexOf(id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const update = db.prepare("UPDATE vehicles SET position = ? WHERE id = ?");
  db.transaction(() => ids.forEach((vid, pos) => update.run(pos, vid)))();
}

export function addPhoto(vehicleId: number, photo: Omit<Photo, "id" | "position">): Photo {
  const db = getDb();
  const max = db.prepare("SELECT COALESCE(MAX(position), -1) AS m FROM photos WHERE vehicle_id = ?").get(vehicleId) as { m: number };
  const info = db
    .prepare("INSERT INTO photos (vehicle_id, file, width, height, transparent, position) VALUES (?, ?, ?, ?, ?, ?)")
    .run(vehicleId, photo.file, photo.width, photo.height, photo.transparent ? 1 : 0, max.m + 1);
  db.prepare("UPDATE vehicles SET updated_at = datetime('now') WHERE id = ?").run(vehicleId);
  return { ...photo, id: Number(info.lastInsertRowid), position: max.m + 1 };
}

/** Returns the deleted file name, or null if the photo does not belong to the vehicle. */
export function deletePhoto(vehicleId: number, photoId: number): string | null {
  const db = getDb();
  const row = db.prepare("SELECT file FROM photos WHERE id = ? AND vehicle_id = ?").get(photoId, vehicleId) as { file: string } | undefined;
  if (!row) return null;
  db.prepare("DELETE FROM photos WHERE id = ?").run(photoId);
  return row.file;
}

/** Sets photo order; the first one is the main photo. Unknown ids are ignored. */
export function reorderPhotos(vehicleId: number, orderedIds: number[]) {
  const db = getDb();
  const existing = (db.prepare("SELECT id FROM photos WHERE vehicle_id = ? ORDER BY position, id").all(vehicleId) as { id: number }[]).map((r) => r.id);
  const known = orderedIds.filter((id) => existing.includes(id));
  const rest = existing.filter((id) => !known.includes(id));
  const update = db.prepare("UPDATE photos SET position = ? WHERE id = ?");
  db.transaction(() => [...known, ...rest].forEach((id, pos) => update.run(pos, id)))();
  db.prepare("UPDATE vehicles SET updated_at = datetime('now') WHERE id = ?").run(vehicleId);
}

export function clearLegacyPhoto(vehicleId: number) {
  getDb().prepare("UPDATE vehicles SET legacy_photo_url = NULL WHERE id = ?").run(vehicleId);
}

export function vehicleName(v: Pick<Vehicle, "brand" | "model">) {
  return `${v.brand} ${v.model}`.trim();
}
