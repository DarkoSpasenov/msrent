"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  checkPassword,
  clearFailures,
  createSessionToken,
  isPasswordConfigured,
  loginBlocked,
  recordFailure,
  requireAdmin,
} from "@/lib/auth";
import { removeImageFiles } from "@/lib/images";
import { importLegacyPhotos, type ImportResult } from "@/lib/importer";
import { getSetting, setSetting } from "@/lib/settings";
import {
  createVehicle,
  deleteVehicle as dbDeleteVehicle,
  moveVehicle as dbMoveVehicle,
  setAvailability,
  updateVehicle,
  type VehicleInput,
} from "@/lib/vehicles";

function refreshSite() {
  revalidatePath("/", "layout");
}

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

// ---------- Session ----------

export async function login(_prev: { error?: string } | undefined, form: FormData): Promise<{ error?: string }> {
  if (!isPasswordConfigured()) return { error: "L'administration n'est pas configurée (ADMIN_PASSWORD manquant sur le serveur)." };
  const ip = await clientIp();
  if (loginBlocked(ip)) return { error: "Trop de tentatives. Réessayez dans 15 minutes." };
  if (!checkPassword(String(form.get("password") ?? ""))) {
    recordFailure(ip);
    return { error: "Mot de passe incorrect." };
  }
  clearFailures(ip);
  const { token, maxAge } = createSessionToken();
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Vehicles ----------

export type SaveResult = { ok: true; id: number; slug: string } | { ok: false; error: string; fields?: Record<string, string> };

function int(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").trim().replace(/[’'\s]/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n) : NaN;
}

function parseVehicle(form: FormData): { input?: VehicleInput; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  const brand = String(form.get("brand") ?? "").trim();
  const model = String(form.get("model") ?? "").trim();
  const transmission = form.get("transmission") === "automatic" ? "automatic" : "manual";
  const seats = int(form.get("seats"));
  const doors = int(form.get("doors"));
  const numbers = {
    priceDay: int(form.get("priceDay")),
    kmDay: int(form.get("kmDay")),
    priceWeek: int(form.get("priceWeek")),
    kmWeek: int(form.get("kmWeek")),
    priceMonth: int(form.get("priceMonth")),
    kmMonth: int(form.get("kmMonth")),
  };
  const description = String(form.get("description") ?? "").trim().slice(0, 3000);
  const available = form.get("available") !== "false";

  if (!brand) fields.brand = "Indiquez la marque.";
  if (!model) fields.model = "Indiquez le modèle.";
  if (brand.length > 40) fields.brand = "40 caractères maximum.";
  if (model.length > 60) fields.model = "60 caractères maximum.";
  if (seats == null || Number.isNaN(seats) || seats < 1 || seats > 9) fields.seats = "Entre 1 et 9.";
  if (doors == null || Number.isNaN(doors) || doors < 2 || doors > 5) fields.doors = "Entre 2 et 5.";
  if (numbers.priceDay == null) fields.priceDay = "Indiquez le prix par jour.";
  for (const [k, v] of Object.entries(numbers)) {
    if (v != null && (Number.isNaN(v) || v < 0 || v > 100000)) fields[k] = "Nombre invalide.";
  }
  if (Object.keys(fields).length) return { fields };
  return {
    fields,
    input: { brand, model, transmission, seats: seats!, doors: doors!, ...numbers, description, available },
  };
}

export async function saveVehicle(id: number | null, form: FormData): Promise<SaveResult> {
  await requireAdmin();
  const { input, fields } = parseVehicle(form);
  if (!input) return { ok: false, error: "Vérifiez les champs en rouge.", fields };
  const vehicle = id == null ? createVehicle(input) : updateVehicle(id, input);
  if (!vehicle) return { ok: false, error: "Ce véhicule n'existe plus." };
  refreshSite();
  return { ok: true, id: vehicle.id, slug: vehicle.slug };
}

export async function toggleAvailability(id: number, available: boolean) {
  await requireAdmin();
  setAvailability(id, available);
  refreshSite();
}

export async function deleteVehicle(id: number) {
  await requireAdmin();
  const files = dbDeleteVehicle(id);
  await Promise.all(files.map(removeImageFiles));
  refreshSite();
}

export async function moveVehicle(id: number, direction: -1 | 1) {
  await requireAdmin();
  dbMoveVehicle(id, direction === -1 ? -1 : 1);
  refreshSite();
}

// ---------- Settings ----------

export type SettingsResult = { ok?: boolean; error?: string };

export async function saveSettings(_prev: SettingsResult | undefined, form: FormData): Promise<SettingsResult> {
  await requireAdmin();
  let whatsapp = String(form.get("whatsapp") ?? "").replace(/\D/g, "");
  if (whatsapp.startsWith("00")) whatsapp = whatsapp.slice(2);
  if (whatsapp.startsWith("0")) whatsapp = `41${whatsapp.slice(1)}`;
  if (whatsapp.length < 10 || whatsapp.length > 15) return { error: "Numéro WhatsApp invalide. Exemple : 076 465 14 12" };
  const phone = String(form.get("phone") ?? "").trim().slice(0, 30);
  const email = String(form.get("email") ?? "").trim().slice(0, 120);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Adresse e-mail invalide." };
  const instagram = String(form.get("instagram") ?? "")
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, "")
    .replace(/\/.*$/, "")
    .slice(0, 40);
  setSetting("whatsapp", whatsapp);
  setSetting("phone", phone);
  setSetting("email", email);
  setSetting("instagram", instagram);
  refreshSite();
  return { ok: true };
}

export async function applyLegacyHero() {
  await requireAdmin();
  const file = getSetting("legacy_hero_image");
  if (file) {
    const previous = getSetting("hero_image");
    setSetting("hero_image", file);
    setSetting("legacy_hero_image", null);
    if (previous && previous !== file) await removeImageFiles(previous);
  }
  refreshSite();
}

export async function removeHero() {
  await requireAdmin();
  const file = getSetting("hero_image");
  setSetting("hero_image", null);
  if (file) await removeImageFiles(file);
  refreshSite();
}

export async function runLegacyImport(): Promise<ImportResult> {
  await requireAdmin();
  const result = await importLegacyPhotos();
  refreshSite();
  return result;
}
