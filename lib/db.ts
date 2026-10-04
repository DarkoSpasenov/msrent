import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import seedVehicles from "@/seed/vehicles.json";
import seedSite from "@/seed/site.json";

export const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(/* turbopackIgnore: true */ process.cwd(), "data"));
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('manual','automatic')),
  seats INTEGER NOT NULL,
  doors INTEGER NOT NULL,
  price_day INTEGER,
  km_day INTEGER,
  price_week INTEGER,
  km_week INTEGER,
  price_month INTEGER,
  km_month INTEGER,
  description TEXT NOT NULL DEFAULT '',
  available INTEGER NOT NULL DEFAULT 1,
  position INTEGER NOT NULL DEFAULT 0,
  legacy_photo_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  file TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  transparent INTEGER NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS photos_vehicle ON photos(vehicle_id, position);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

function open() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new Database(path.join(DATA_DIR, "msrent.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  db.exec(SCHEMA);
  seed(db);
  return db;
}

// First start only: copy the vehicles and contact details of the former site.
// A "seeded" flag prevents re-creating cars the owner deleted later.
function seed(db: Database.Database) {
  const done = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get();
  if (done) return;
  const insert = db.prepare(`INSERT OR IGNORE INTO vehicles
    (slug, brand, model, transmission, seats, doors, price_day, km_day, price_week, km_week, price_month, km_month, position, legacy_photo_url)
    VALUES (@slug, @brand, @model, @transmission, @seats, @doors, @priceDay, @kmDay, @priceWeek, @kmWeek, @priceMonth, @kmMonth, @position, @legacyPhotoUrl)`);
  const setting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  db.transaction(() => {
    seedVehicles.forEach((v, i) => insert.run({ ...v, position: i }));
    setting.run("whatsapp", seedSite.whatsapp);
    setting.run("phone", seedSite.phone);
    setting.run("email", seedSite.email);
    setting.run("instagram", seedSite.instagram);
    setting.run("legacy_hero_url", seedSite.legacyHeroUrl);
    setting.run("seeded", new Date().toISOString());
  })();
}

const g = globalThis as unknown as { __msrentDb?: Database.Database };
export function getDb(): Database.Database {
  return g.__msrentDb ?? (g.__msrentDb = open());
}
