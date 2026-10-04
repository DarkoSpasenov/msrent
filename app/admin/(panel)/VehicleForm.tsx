"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveVehicle } from "@/app/admin/actions";
import { Switch } from "@/app/admin/(panel)/Switch";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

export type VehicleFormValues = {
  id: number | null;
  slug?: string;
  brand: string;
  model: string;
  transmission: "manual" | "automatic";
  seats: number | null;
  doors: number | null;
  priceDay: number | null;
  kmDay: number | null;
  priceWeek: number | null;
  kmWeek: number | null;
  priceMonth: number | null;
  kmMonth: number | null;
  description: string;
  available: boolean;
  photos: { id: number; preview: string }[];
};

type Item = { key: string; id?: number; preview: string; file?: File; status?: "uploading" | "error"; error?: string };

/** Shrinks big phone photos before sending them (also turns HEIC into JPEG on iPhone). */
async function prepare(file: File): Promise<Blob> {
  if (file.size < 1_500_000 && /image\/(jpeg|png|webp)/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const keepAlpha = file.type === "image/png" || file.type === "image/webp";
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, keepAlpha ? "image/png" : "image/jpeg", 0.9));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

async function upload(vehicleId: number, file: File): Promise<{ id: number; preview: string }> {
  const body = new FormData();
  const blob = await prepare(file);
  body.append("file", blob, file.name);
  const res = await fetch(`/api/admin/vehicles/${vehicleId}/photos`, { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Envoi impossible");
  return { id: data.photo.id, preview: data.photo.preview };
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
      {error && <span className="mt-1 block text-sm font-medium text-signal">{error}</span>}
    </div>
  );
}

function NumberInput({ name, value, suffix, invalid }: { name: string; value: number | null; suffix: string; invalid?: boolean }) {
  return (
    <div className="relative">
      <input name={name} type="text" inputMode="numeric" pattern="[0-9 ']*" defaultValue={value ?? ""} aria-invalid={invalid} className={`field pr-14 ${invalid ? "border-signal" : ""}`} />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted">{suffix}</span>
    </div>
  );
}

export function VehicleForm({ initial }: { initial: VehicleFormValues }) {
  const router = useRouter();
  const editing = initial.id != null;
  const [items, setItems] = useState<Item[]>(initial.photos.map((p) => ({ key: `s${p.id}`, id: p.id, preview: p.preview })));
  const [transmission, setTransmission] = useState(initial.transmission);
  const [available, setAvailable] = useState(initial.available);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);

  const busy = !!saving || items.some((i) => i.status === "uploading");

  async function persistOrder(next: Item[]) {
    if (!editing) return;
    const order = next.filter((i) => i.id != null).map((i) => i.id!);
    await fetch(`/api/admin/vehicles/${initial.id}/photos`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    router.refresh();
  }

  function move(index: number, to: number) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [it] = next.splice(index, 1);
    next.splice(to, 0, it);
    setItems(next);
    void persistOrder(next);
  }

  async function remove(index: number) {
    const it = items[index];
    if (editing && it.id != null) {
      if (!confirm("Supprimer cette photo ?")) return;
      const res = await fetch(`/api/admin/vehicles/${initial.id}/photos/${it.id}`, { method: "DELETE" });
      if (!res.ok) return alert("Suppression impossible. Réessayez.");
      router.refresh();
    }
    if (it.file) URL.revokeObjectURL(it.preview);
    setItems((list) => list.filter((x) => x.key !== it.key));
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const added: Item[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .map((file) => ({ key: `n${crypto.randomUUID()}`, preview: URL.createObjectURL(file), file, status: editing ? "uploading" : undefined }));
    setItems((list) => [...list, ...added]);
    if (fileInput.current) fileInput.current.value = "";
    if (!editing) return;
    // Edit mode: photos are saved right away, one after the other to keep the order.
    for (const it of added) {
      try {
        const saved = await upload(initial.id!, it.file!);
        setItems((list) => list.map((x) => (x.key === it.key ? { key: it.key, id: saved.id, preview: it.preview } : x)));
      } catch (e) {
        setItems((list) => list.map((x) => (x.key === it.key ? { ...x, status: "error", error: (e as Error).message } : x)));
      }
    }
    router.refresh();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(undefined);
    setFields({});
    const form = new FormData(e.currentTarget);
    form.set("transmission", transmission);
    form.set("available", String(available));
    setSaving("Enregistrement…");
    const result = await saveVehicle(initial.id, form);
    if (!result.ok) {
      setSaving(undefined);
      setError(result.error);
      setFields(result.fields ?? {});
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!editing) {
      const pending = items.filter((i) => i.file);
      let failed = 0;
      for (const [n, it] of pending.entries()) {
        setSaving(`Envoi des photos ${n + 1}/${pending.length}…`);
        try {
          await upload(result.id, it.file!);
        } catch {
          failed++;
        }
      }
      if (failed) {
        alert(`${failed} photo(s) n'ont pas pu être envoyées. Vous pouvez les rajouter en modifiant le véhicule.`);
        router.push(`/admin/vehicules/${result.id}`);
        return;
      }
    }
    router.push("/admin?ok=saved");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ChevronLeftIcon width={16} height={16} /> Véhicules
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold">{editing ? `Modifier la ${initial.brand} ${initial.model}` : "Ajouter un véhicule"}</h1>
      </div>

      {error && (
        <p className="rounded-2xl bg-signal/10 px-4 py-3 text-sm font-medium text-signal" role="alert">
          {error}
        </p>
      )}

      <section className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-bold">Véhicule</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Marque" error={fields.brand}>
            <input name="brand" defaultValue={initial.brand} placeholder="Ex. Ford" className={`field ${fields.brand ? "border-signal" : ""}`} autoComplete="off" />
          </Field>
          <Field label="Modèle" error={fields.model}>
            <input name="model" defaultValue={initial.model} placeholder="Ex. Fiesta" className={`field ${fields.model ? "border-signal" : ""}`} autoComplete="off" />
          </Field>
        </div>
        <Field label="Transmission">
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Transmission">
            {(["manual", "automatic"] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={transmission === t}
                onClick={() => setTransmission(t)}
                className={`min-h-12 rounded-xl border text-sm font-semibold transition-colors ${transmission === t ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40"}`}
              >
                {t === "manual" ? "Manuelle" : "Automatique"}
              </button>
            ))}
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre de places" error={fields.seats}>
            <input name="seats" type="number" inputMode="numeric" min={1} max={9} defaultValue={initial.seats ?? ""} className={`field ${fields.seats ? "border-signal" : ""}`} />
          </Field>
          <Field label="Nombre de portes" error={fields.doors}>
            <input name="doors" type="number" inputMode="numeric" min={2} max={5} defaultValue={initial.doors ?? ""} className={`field ${fields.doors ? "border-signal" : ""}`} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <h2 className="text-lg font-bold">Tarifs</h2>
        {(
          [
            ["Jour", "priceDay", "kmDay", initial.priceDay, initial.kmDay],
            ["Semaine", "priceWeek", "kmWeek", initial.priceWeek, initial.kmWeek],
            ["Mois", "priceMonth", "kmMonth", initial.priceMonth, initial.kmMonth],
          ] as const
        ).map(([label, p, k, pv, kv]) => (
          <div key={p} className="grid grid-cols-2 gap-4">
            <Field label={`Prix / ${label.toLowerCase()}`} error={fields[p]} hint={p === "priceDay" ? undefined : "Facultatif"}>
              <NumberInput name={p} value={pv} suffix="CHF" invalid={!!fields[p]} />
            </Field>
            <Field label={`Km inclus / ${label.toLowerCase()}`} error={fields[k]}>
              <NumberInput name={k} value={kv} suffix="km" invalid={!!fields[k]} />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold">Photos</h2>
          <p className="mt-1 text-sm text-muted">
            La première photo est la photo principale.{" "}
            {editing ? "Les changements de photos sont enregistrés immédiatement." : "Les photos sont envoyées à la publication."}
          </p>
        </div>
        {items.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((it, i) => (
              <li key={it.key} className={`overflow-hidden rounded-2xl border bg-paper ${i === 0 ? "border-ink" : "border-line"}`}>
                <div className="relative aspect-[4/3] bg-mist">
                  <img src={it.preview} alt="" className="h-full w-full object-cover" />
                  {i === 0 && <span className="absolute top-2 left-2 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">Principale</span>}
                  {it.status === "uploading" && <span className="absolute inset-0 grid place-items-center bg-white/70 text-sm font-semibold">Envoi…</span>}
                  {it.status === "error" && (
                    <span className="absolute inset-0 grid place-items-center bg-white/85 p-2 text-center text-xs font-semibold text-signal">{it.error}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    disabled={it.status === "uploading"}
                    className="absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-card hover:text-signal"
                    aria-label="Supprimer la photo"
                  >
                    <CloseIcon width={18} height={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0 || busy} className="grid h-9 w-9 place-items-center rounded-full hover:bg-mist disabled:opacity-25" aria-label="Déplacer à gauche">
                    <ChevronLeftIcon width={18} height={18} />
                  </button>
                  {i !== 0 ? (
                    <button type="button" onClick={() => move(i, 0)} disabled={busy || it.status === "error"} className="rounded-full px-2 py-1.5 text-xs font-semibold hover:bg-mist">
                      Principale
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="button" onClick={() => move(i, i + 1)} disabled={i === items.length - 1 || busy} className="grid h-9 w-9 place-items-center rounded-full hover:bg-mist disabled:opacity-25" aria-label="Déplacer à droite">
                    <ChevronRightIcon width={18} height={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-line bg-paper p-6 text-center hover:border-ink/40">
          <span className="font-semibold">+ Ajouter des photos</span>
          <span className="text-sm text-muted">Plusieurs photos possibles · optimisées automatiquement</span>
          <input ref={fileInput} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        </label>
      </section>

      <section className="space-y-4 rounded-[var(--radius-card)] border border-line bg-surface p-5 sm:p-6">
        <Field label="Description (facultative)">
          <textarea name="description" defaultValue={initial.description} rows={4} maxLength={3000} className="field" placeholder="Ex. Idéale en ville, faible consommation…" />
        </Field>
        <div className="flex items-center justify-between gap-4 rounded-xl bg-paper p-4">
          <div>
            <p className="font-semibold">{available ? "Disponible" : "Indisponible"}</p>
            <p className="text-sm text-muted">{available ? "Réservable sur le site." : "Affiché « Actuellement indisponible »."}</p>
          </div>
          <Switch checked={available} onChange={setAvailable} label="Disponible" />
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <button type="submit" disabled={busy} className="btn-dark w-full text-base sm:w-auto sm:px-10">
          {saving ?? (editing ? "Enregistrer les modifications" : "Publier le véhicule")}
        </button>
      </div>
    </form>
  );
}
