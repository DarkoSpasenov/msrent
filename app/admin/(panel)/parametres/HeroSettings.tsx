"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { applyLegacyHero, removeHero } from "@/app/admin/actions";

export function HeroSettings({ current, legacy }: { current: string | null; legacy: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string>();

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(undefined);
    const body = new FormData();
    body.append("file", file);
    start(async () => {
      const res = await fetch("/api/admin/hero", { method: "POST", body });
      if (!res.ok) setError((await res.json().catch(() => ({}))).error || "Envoi impossible.");
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold">Image d&apos;accueil</h2>
        <p className="mt-1 text-sm text-muted">
          Grande photo en arrière-plan de la première section. Sans image, l&apos;accueil affiche la photo principale du premier véhicule disponible.
        </p>
      </div>
      {current && <img src={current} alt="Image d'accueil actuelle" className="aspect-[21/9] w-full rounded-2xl object-cover" />}
      <div className="flex flex-wrap gap-2">
        <label className={`btn-dark cursor-pointer ${pending ? "opacity-60" : ""}`}>
          {pending ? "Envoi…" : current ? "Remplacer l'image" : "Choisir une image"}
          <input type="file" accept="image/*" className="sr-only" disabled={pending} onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {current && (
          <button type="button" disabled={pending} onClick={() => start(async () => { await removeHero(); router.refresh(); })} className="btn-outline">
            Retirer
          </button>
        )}
      </div>
      {error && <p className="text-sm font-medium text-signal">{error}</p>}
      {legacy && (
        <div className="rounded-2xl bg-paper p-4">
          <p className="text-sm font-semibold">Image de fond de l&apos;ancien site</p>
          <img src={legacy} alt="Image de l'ancien site" className="mt-3 aspect-[21/9] w-full rounded-xl object-cover" />
          <button type="button" disabled={pending} onClick={() => start(async () => { await applyLegacyHero(); router.refresh(); })} className="btn-outline mt-3 min-h-10 text-sm">
            Utiliser comme image d&apos;accueil
          </button>
        </div>
      )}
    </section>
  );
}
