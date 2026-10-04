"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";

type Values = { whatsapp: string; phone: string; email: string; instagram: string };

export function SettingsForm({ initial }: { initial: Values }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  return (
    <form action={action} className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold">Coordonnées</h2>
        <p className="mt-1 text-sm text-muted">Utilisées partout sur le site et dans les liens WhatsApp.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="whatsapp" className="label">
            Numéro WhatsApp
          </label>
          <input id="whatsapp" name="whatsapp" defaultValue={`+${initial.whatsapp}`} inputMode="tel" className="field" required />
          <span className="mt-1 block text-xs text-muted">Ex. 076 465 14 12, converti automatiquement au format +41.</span>
        </div>
        <div>
          <label htmlFor="phone" className="label">
            Téléphone affiché
          </label>
          <input id="phone" name="phone" defaultValue={initial.phone} inputMode="tel" className="field" />
        </div>
        <div>
          <label htmlFor="email" className="label">
            E-mail
          </label>
          <input id="email" name="email" type="email" defaultValue={initial.email} className="field" />
        </div>
        <div>
          <label htmlFor="instagram" className="label">
            Instagram
          </label>
          <input id="instagram" name="instagram" defaultValue={initial.instagram ? `@${initial.instagram}` : ""} className="field" placeholder="@ms.rent.car" />
        </div>
      </div>
      {state?.error && (
        <p className="text-sm font-medium text-signal" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="text-sm font-medium text-wa-dark" role="status">
          Enregistré.
        </p>
      )}
      <button type="submit" disabled={pending} className="btn-dark">
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}
