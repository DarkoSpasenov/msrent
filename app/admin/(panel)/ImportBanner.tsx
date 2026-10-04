"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { runLegacyImport } from "@/app/admin/actions";

export function ImportBanner({ count }: { count: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string>();
  return (
    <div className="mb-6 rounded-2xl border border-line bg-surface p-4 text-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
      <p className="text-muted">
        {message ??
          (count > 0
            ? `Les photos de ${count} véhicule${count > 1 ? "s" : ""} de l'ancien site n'ont pas encore été importées.`
            : "L'image d'accueil de l'ancien site n'a pas encore été importée.")}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await runLegacyImport();
            setMessage(
              r.failed
                ? `${r.imported} importée(s), ${r.failed} échec(s). Le serveur n'a peut-être pas accès à l'ancien site : ajoutez les photos à la main.`
                : `${r.imported} photo(s) importée(s).`,
            );
            router.refresh();
          })
        }
        className="btn-outline mt-3 min-h-10 shrink-0 text-sm sm:mt-0"
      >
        {pending ? "Import en cours…" : "Importer maintenant"}
      </button>
    </div>
  );
}
