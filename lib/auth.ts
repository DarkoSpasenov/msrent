import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "msrent_admin";
const SESSION_DAYS = 30;

function secret(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) throw new Error("ADMIN_PASSWORD n'est pas défini.");
  // Including the password means changing it logs every device out.
  return crypto.createHash("sha256").update(`${process.env.SESSION_SECRET ?? ""}:${pw}`).digest("hex");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function isPasswordConfigured(): boolean {
  return !!process.env.ADMIN_PASSWORD;
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  return safeEqual(input, pw);
}

export function createSessionToken(): { token: string; maxAge: number } {
  const maxAge = SESSION_DAYS * 86400;
  const exp = String(Math.floor(Date.now() / 1000) + maxAge);
  return { token: `${exp}.${sign(exp)}`, maxAge };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export class UnauthorizedError extends Error {}

/** Use at the top of every admin action and route handler. */
export async function requireAdmin() {
  if (!(await isAdmin())) throw new UnauthorizedError("Non autorisé");
}

// Basic brute-force protection: 8 failed attempts per IP per 15 minutes.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60 * 1000;

export function loginBlocked(ip: string): boolean {
  const a = attempts.get(ip);
  return !!a && a.until > Date.now() && a.count >= 8;
}

export function recordFailure(ip: string) {
  const now = Date.now();
  const a = attempts.get(ip);
  if (!a || a.until < now) attempts.set(ip, { count: 1, until: now + WINDOW });
  else a.count++;
}

export function clearFailures(ip: string) {
  attempts.delete(ip);
}
