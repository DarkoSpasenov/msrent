const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

/** "2026-10-12" → "12 octobre 2026" (no timezone shift). */
export function formatDateFr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function utc(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Days between two ISO dates, as counted in car rental: 12 → 15 = 3 days. */
export function daysBetween(from: string, to: string): number | null {
  const diff = Math.round((utc(to) - utc(from)) / 86_400_000);
  return Number.isNaN(diff) ? null : diff;
}

export function whatsappUrl(number: string, text: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export type BookingRequest = {
  vehicle?: string;
  from?: string;
  to?: string;
  name?: string;
  phone?: string;
};

export function bookingMessage({ vehicle, from, to, name, phone }: BookingRequest): string {
  const lines = ["Bonjour MS Rent,"];
  lines.push(vehicle ? `Je souhaiterais louer la ${vehicle}.` : "Je souhaiterais louer une voiture.");
  if (from || to) lines.push("");
  if (from) lines.push(`Date de départ : ${formatDateFr(from)}`);
  if (to) lines.push(`Date de retour : ${formatDateFr(to)}`);
  if (from && to) {
    const days = daysBetween(from, to);
    if (days && days > 0) lines.push(`Durée : ${days} jour${days > 1 ? "s" : ""}`);
  }
  if (name?.trim() || phone?.trim()) lines.push("");
  if (name?.trim()) lines.push(`Nom : ${name.trim()}`);
  if (phone?.trim()) lines.push(`Téléphone : ${phone.trim()}`);
  lines.push("");
  lines.push(vehicle ? "Pouvez-vous me confirmer sa disponibilité et le tarif ?" : "Pouvez-vous me renseigner sur les disponibilités ?");
  lines.push("Merci.");
  return lines.join("\n");
}
