import Link from "next/link";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { DoorIcon, GearboxIcon, SeatIcon, WhatsAppIcon } from "@/components/icons";
import { formatChf, formatKm, transmissionLabel } from "@/components/specs";
import type { Vehicle } from "@/lib/vehicles";
import { vehicleName } from "@/lib/vehicles";
import { bookingMessage, whatsappUrl } from "@/lib/whatsapp";

export function VehicleCard({ vehicle, whatsapp, priority = false }: { vehicle: Vehicle; whatsapp: string; priority?: boolean }) {
  const name = vehicleName(vehicle);
  const href = `/voitures/${vehicle.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-card transition-shadow hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-mist" tabIndex={-1} aria-hidden="true">
        <VehiclePhoto
          photo={vehicle.photos[0]}
          alt={`Location ${name} à Yverdon-les-Bains`}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${vehicle.available ? "" : "opacity-60 grayscale"}`}
        />
        {!vehicle.available && (
          <span className="absolute top-3 left-3 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">Actuellement indisponible</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{vehicle.brand}</p>
            <h3 className="mt-1 text-2xl font-bold">
              <Link href={href} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                {name}
              </Link>
            </h3>
          </div>
          {vehicle.priceDay != null && (
            <p className="shrink-0 text-right">
              <span className="font-display text-3xl font-extrabold tracking-tight">{formatChf(vehicle.priceDay)}</span>
              <span className="ml-1 text-sm font-semibold">CHF</span>
              <span className="block text-xs text-muted">par jour</span>
            </p>
          )}
        </div>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <li className="inline-flex items-center gap-1.5">
            <GearboxIcon width={17} height={17} /> {transmissionLabel(vehicle.transmission)}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <SeatIcon width={17} height={17} /> {vehicle.seats} places
          </li>
          <li className="inline-flex items-center gap-1.5">
            <DoorIcon width={17} height={17} /> {vehicle.doors} portes
          </li>
        </ul>
        {vehicle.kmDay != null && <p className="mt-3 text-sm text-muted">{formatKm(vehicle.kmDay)} inclus par jour</p>}

        <div className="mt-6 grid grid-cols-2 gap-2 pt-1 sm:mt-auto sm:pt-6">
          <Link href={href} className="btn-outline px-3 text-sm">
            Voir le véhicule
          </Link>
          {vehicle.available ? (
            <a
              href={whatsappUrl(whatsapp, bookingMessage({ vehicle: name }))}
              target="_blank"
              rel="noopener"
              className="btn-wa px-3 text-sm"
              aria-label={`Réserver la ${name} sur WhatsApp`}
            >
              <WhatsAppIcon width={17} height={17} /> Réserver
            </a>
          ) : (
            <span className="btn cursor-not-allowed bg-mist px-3 text-sm text-muted" aria-disabled="true">
              Indisponible
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
