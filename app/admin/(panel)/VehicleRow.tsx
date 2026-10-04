"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteVehicle, moveVehicle, toggleAvailability } from "@/app/admin/actions";
import { Switch } from "@/app/admin/(panel)/Switch";
import { CarIcon, ChevronLeftIcon } from "@/components/icons";

type Props = {
  id: number;
  name: string;
  slug: string;
  priceDay: number | null;
  available: boolean;
  thumb: string | null;
  photoCount: number;
  first: boolean;
  last: boolean;
};

export function VehicleRow({ id, name, slug, priceDay, available, thumb, photoCount, first, last }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [optimisticAvailable, setOptimistic] = useOptimistic(available);

  return (
    <li className={`rounded-2xl border border-line bg-surface p-3 sm:p-4 ${pending ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-mist sm:h-20 sm:w-28">
          {thumb ? (
            <img src={thumb} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-muted/50">
              <CarIcon />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold">{name}</p>
          <p className="text-sm text-muted">
            {priceDay != null ? `${priceDay} CHF / jour` : "Prix non renseigné"} · {photoCount} photo{photoCount > 1 ? "s" : ""}
          </p>
        </div>
        <label className="flex flex-col items-center gap-1 text-[11px] font-medium text-muted sm:flex-row sm:gap-3 sm:text-sm">
          <span className="order-2 sm:order-1">{optimisticAvailable ? "Disponible" : "Indisponible"}</span>
          <span className="order-1 sm:order-2">
            <Switch
              checked={optimisticAvailable}
              label={`${name} disponible`}
              onChange={(v) =>
                start(async () => {
                  setOptimistic(v);
                  await toggleAvailability(id, v);
                  router.refresh();
                })
              }
            />
          </span>
        </label>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
        <Link href={`/admin/vehicules/${id}`} className="btn-outline min-h-10 flex-1 px-4 text-sm sm:flex-none">
          Modifier
        </Link>
        <a href={`/voitures/${slug}`} target="_blank" className="btn hidden min-h-10 px-3 text-sm text-muted hover:text-ink sm:inline-flex">
          Voir
        </a>
        <div className="ml-auto flex items-center">
          <button
            type="button"
            disabled={first || pending}
            onClick={() => start(async () => { await moveVehicle(id, -1); router.refresh(); })}
            className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-mist disabled:opacity-30"
            aria-label={`Monter ${name}`}
          >
            <ChevronLeftIcon className="rotate-90" />
          </button>
          <button
            type="button"
            disabled={last || pending}
            onClick={() => start(async () => { await moveVehicle(id, 1); router.refresh(); })}
            className="grid h-10 w-10 place-items-center rounded-full text-muted hover:bg-mist disabled:opacity-30"
            aria-label={`Descendre ${name}`}
          >
            <ChevronLeftIcon className="-rotate-90" />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm(`Supprimer définitivement la ${name} et ses photos ?`)) return;
              start(async () => {
                await deleteVehicle(id);
                router.push("/admin?ok=deleted");
                router.refresh();
              });
            }}
            className="btn min-h-10 px-2.5 text-sm text-signal hover:bg-signal/10 sm:px-3"
          >
            Supprimer
          </button>
        </div>
      </div>
    </li>
  );
}
