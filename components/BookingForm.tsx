"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { bookingMessage, daysBetween, whatsappUrl } from "@/lib/whatsapp";

function isoToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function BookingForm({ vehicle, whatsapp, available }: { vehicle: string; whatsapp: string; available: boolean }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [today, setToday] = useState<string>();
  useEffect(() => setToday(isoToday()), []);

  const days = from && to ? daysBetween(from, to) : null;
  const invalid = days != null && days < 1;
  const href = useMemo(() => whatsappUrl(whatsapp, bookingMessage({ vehicle, from, to, name, phone })), [whatsapp, vehicle, from, to, name, phone]);

  if (!available) {
    return (
      <div id="reserver" className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <p className="font-display text-lg font-bold">Actuellement indisponible</p>
        <p className="mt-1.5 text-muted">Cette voiture n&apos;est pas disponible pour le moment. Découvrez nos autres véhicules.</p>
        <button type="button" disabled className="btn mt-5 w-full bg-mist text-muted">
          Réservation désactivée
        </button>
        <Link href="/voitures" className="btn-dark mt-2 w-full">
          Voir les autres voitures
        </Link>
      </div>
    );
  }

  return (
    <form
      id="reserver"
      className="rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!invalid) window.open(href, "_blank", "noopener");
      }}
    >
      <h2 className="text-xl font-bold">Demander la disponibilité</h2>
      <p className="mt-1 text-sm text-muted">Le message WhatsApp est rédigé pour vous : il ne reste qu&apos;à l&apos;envoyer.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="depart" className="label">
            Date de départ
          </label>
          <input
            id="depart"
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
          <label htmlFor="retour" className="label">
            Date de retour
          </label>
          <input id="retour" type="date" className="field px-3" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} aria-invalid={invalid} />
        </div>
      </div>
      {invalid ? (
        <p className="mt-2 text-sm font-medium text-signal" role="alert">
          La date de retour doit être après la date de départ.
        </p>
      ) : (
        days != null && (
          <p className="mt-2 text-sm text-muted" aria-live="polite">
            Durée : {days} jour{days > 1 ? "s" : ""}
          </p>
        )
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="nom" className="label">
            Nom
          </label>
          <input id="nom" type="text" className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
        </div>
        <div>
          <label htmlFor="tel" className="label">
            Téléphone <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id="tel" type="tel" className="field" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="079 123 45 67" />
        </div>
      </div>

      <a
        href={invalid ? undefined : href}
        target="_blank"
        rel="noopener"
        aria-disabled={invalid}
        className={`btn-wa mt-5 w-full min-h-14 text-center text-base leading-tight ${invalid ? "pointer-events-none opacity-50" : ""}`}
      >
        <WhatsAppIcon width={22} height={22} /> Demander la disponibilité sur WhatsApp
      </a>
      <p className="mt-3 text-center text-xs text-muted">Sans engagement · Sans paiement en ligne</p>
    </form>
  );
}
