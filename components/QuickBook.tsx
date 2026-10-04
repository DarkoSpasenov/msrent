"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { bookingMessage, daysBetween, whatsappUrl } from "@/lib/whatsapp";

function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Home page shortcut: pick a car and dates, then open WhatsApp. */
export function QuickBook({ cars, whatsapp }: { cars: { name: string; priceDay: number | null }[]; whatsapp: string }) {
  const [car, setCar] = useState(cars[0]?.name ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(isoToday()), []);

  const days = from && to ? daysBetween(from, to) : null;
  const invalid = days != null && days < 1;
  const href = whatsappUrl(whatsapp, bookingMessage({ vehicle: car || undefined, from, to }));

  return (
    <form
      className="grid gap-3 rounded-[28px] bg-white p-4 shadow-float sm:p-5 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        if (!invalid) window.open(href, "_blank", "noopener");
      }}
      aria-label="Réservation rapide"
    >
      <div>
        <label htmlFor="qb-car" className="label">
          Voiture
        </label>
        <select id="qb-car" className="field appearance-none bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10" value={car} onChange={(e) => setCar(e.target.value)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23586074' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
          {cars.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
              {c.priceDay != null ? ` — ${c.priceDay} CHF/jour` : ""}
            </option>
          ))}
          <option value="">Je ne sais pas encore</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:contents">
        <div>
          <label htmlFor="qb-from" className="label">
            Départ
          </label>
          <input
            id="qb-from"
            type="date"
            className="field px-3"
            min={today}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (to && e.target.value && to <= e.target.value) setTo("");
            }}
          />
        </div>
        <div>
          <label htmlFor="qb-to" className="label">
            Retour
          </label>
          <input id="qb-to" type="date" className="field px-3" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} aria-invalid={invalid} />
        </div>
      </div>
      <a
        href={invalid ? undefined : href}
        target="_blank"
        rel="noopener"
        aria-disabled={invalid}
        className={`btn-wa min-h-12 text-base lg:px-7 ${invalid ? "pointer-events-none opacity-50" : ""}`}
      >
        <WhatsAppIcon /> Réserver sur WhatsApp
      </a>
      {invalid && (
        <p className="text-sm font-semibold text-alert lg:col-span-4" role="alert">
          La date de retour doit être après la date de départ.
        </p>
      )}
    </form>
  );
}
