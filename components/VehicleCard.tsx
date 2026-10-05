import Link from "next/link";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { ArrowRightIcon, WhatsAppIcon } from "@/components/icons";
import { formatChf, transmissionLabel } from "@/components/specs";
import type { Vehicle } from "@/lib/vehicles";
import { vehicleName } from "@/lib/vehicles";
import { bookingMessage, whatsappUrl } from "@/lib/whatsapp";

export function VehicleCard({ vehicle, whatsapp, tone, priority = false }: { vehicle: Vehicle; whatsapp: string; tone: string; priority?: boolean }) {
  const name = vehicleName(vehicle);
  const href = `/voitures/${vehicle.slug}/`;
  const specs = [transmissionLabel(vehicle.transmission), `${vehicle.seats} places`, `${vehicle.doors} portes`];

  return (
    <article className="group flex flex-col">
      <Link
        href={href}
        className={`relative block aspect-[5/4] overflow-hidden rounded-[28px] ${vehicle.available ? tone : "bg-cloud"}`}
        aria-label={`Voir la ${name}`}
      >
        <VehiclePhoto
          photo={vehicle.photos[0]}
          alt={`Location ${name} à Yverdon-les-Bains`}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.04] ${vehicle.available ? "" : "opacity-50 grayscale"}`}
        />
        {vehicle.available ? (
          vehicle.priceDay != null && (
            <span className="absolute top-4 right-4 rounded-2xl bg-ink px-3.5 py-2 text-white">
              <span className="font-display text-xl font-extrabold">{formatChf(vehicle.priceDay)}</span>
              <span className="text-xs font-semibold text-white/70"> CHF/jour</span>
            </span>
          )
        ) : (
          <span className="absolute top-4 right-4 rounded-full bg-ink px-3 py-1.5 text-xs font-bold text-white">Indisponible</span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-[26px] leading-tight font-extrabold">
          <Link href={href} className="hover:text-brand-ink">
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[15px] text-muted">{specs.join(" · ")}</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-auto sm:pt-5">
          <Link href={href} className="btn-outline px-3 text-sm">
            Détails <ArrowRightIcon width={16} height={16} />
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
            <span className="btn cursor-not-allowed bg-cloud px-3 text-sm text-muted" aria-disabled="true">
              Indisponible
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
