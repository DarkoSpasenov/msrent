import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { Gallery } from "@/components/Gallery";
import { JsonLd, vehicleJsonLd } from "@/components/JsonLd";
import { VehicleCard } from "@/components/VehicleCard";
import { ChevronLeftIcon, DoorIcon, GearboxIcon, SeatIcon, WhatsAppIcon } from "@/components/icons";
import { formatChf, formatKm, transmissionLabel } from "@/components/specs";
import { photoSrc } from "@/lib/photo";
import { getSettings } from "@/lib/settings";
import { OG_IMAGE, SITE } from "@/lib/site";
import { getVehicleBySlug, listVehicles, vehicleName } from "@/lib/vehicles";
import { bookingMessage, whatsappUrl } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return listVehicles().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = getVehicleBySlug((await params).slug);
  if (!v) return { title: "Véhicule introuvable" };
  const name = vehicleName(v);
  const price = v.priceDay != null ? ` dès ${v.priceDay} CHF par jour` : "";
  const km = v.kmDay != null ? `, ${v.kmDay} km inclus` : "";
  return {
    title: `Location ${name} à Yverdon-les-Bains${price}`,
    description: `Louez la ${name} à Yverdon-les-Bains${price}${km}. Boîte ${transmissionLabel(v.transmission).toLowerCase()}, ${v.seats} places, ${v.doors} portes. Réservation rapide par WhatsApp.`,
    alternates: { canonical: `/voitures/${v.slug}/` },
    openGraph: {
      url: `/voitures/${v.slug}/`,
      title: `Location ${name} | MS Rent Yverdon-les-Bains`,
      images: v.photos[0]
        ? [{ url: `${SITE.origin}${photoSrc(v.photos[0].file, 1600)}`, width: v.photos[0].width, height: v.photos[0].height, alt: name }]
        : [OG_IMAGE],
    },
  };
}

export default async function VehiclePage({ params }: Props) {
  const v = getVehicleBySlug((await params).slug);
  if (!v) notFound();
  const settings = getSettings();
  const name = vehicleName(v);
  const others = listVehicles()
    .filter((o) => o.id !== v.id && o.available)
    .slice(0, 3);

  const rates = [
    { label: "Journée", price: v.priceDay, km: v.kmDay },
    { label: "Semaine", price: v.priceWeek, km: v.kmWeek },
    { label: "Mois", price: v.priceMonth, km: v.kmMonth },
  ].filter((r) => r.price != null);

  return (
    <>
      <JsonLd data={vehicleJsonLd(v)} />
      <div className="container-x pt-5 pb-28 sm:pt-8 md:pb-24">
        <nav aria-label="Fil d'Ariane" className="text-sm text-muted">
          <Link href="/voitures" className="inline-flex items-center gap-1 hover:text-ink">
            <ChevronLeftIcon width={16} height={16} /> Nos voitures
          </Link>
        </nav>

        <div className="mt-4 grid gap-8 lg:mt-6 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <Gallery photos={v.photos} name={name} dimmed={!v.available} />
            {v.description && (
              <div className="mt-8 hidden lg:block">
                <h2 className="text-xl font-bold">À propos de ce véhicule</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">{v.description}</p>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="eyebrow">{v.brand}</p>
            <h1 className="mt-1 text-4xl font-extrabold sm:text-5xl">{name}</h1>
            {!v.available && (
              <p className="mt-3 inline-flex rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-white">Actuellement indisponible</p>
            )}
            {v.priceDay != null && (
              <p className="mt-4">
                <span className="block text-sm text-muted">À partir de</span>
                <span className="font-display text-5xl font-extrabold tracking-tight">{formatChf(v.priceDay)}</span>
                <span className="ml-1.5 text-lg font-semibold">CHF / jour</span>
              </p>
            )}

            <dl className="mt-6 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface">
              <div className="p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <GearboxIcon width={16} height={16} /> Transmission
                </dt>
                <dd className="mt-1 font-semibold">{transmissionLabel(v.transmission)}</dd>
              </div>
              <div className="p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <SeatIcon width={16} height={16} /> Places
                </dt>
                <dd className="mt-1 font-semibold">{v.seats}</dd>
              </div>
              <div className="p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <DoorIcon width={16} height={16} /> Portes
                </dt>
                <dd className="mt-1 font-semibold">{v.doors}</dd>
              </div>
            </dl>

            {rates.length > 0 && (
              <section className="mt-6" aria-labelledby="titre-tarifs">
                <h2 id="titre-tarifs" className="sr-only">
                  Tarifs
                </h2>
                <ul className="grid grid-cols-3 gap-2">
                  {rates.map((r) => (
                    <li key={r.label} className="rounded-2xl border border-line bg-surface p-3 sm:p-4">
                      <span className="block text-xs font-semibold tracking-wide text-muted uppercase">{r.label}</span>
                      <span className="mt-1 block font-display text-2xl font-extrabold">
                        {formatChf(r.price!)} <span className="text-sm font-semibold">CHF</span>
                      </span>
                      {r.km != null && <span className="mt-0.5 block text-xs text-muted sm:text-sm">{formatKm(r.km)} inclus</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-6">
              <BookingForm vehicle={name} whatsapp={settings.whatsapp} available={v.available} />
            </div>

            {v.description && (
              <div className="mt-8 lg:hidden">
                <h2 className="text-xl font-bold">À propos de ce véhicule</h2>
                <p className="mt-3 leading-relaxed whitespace-pre-line text-muted">{v.description}</p>
              </div>
            )}
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-20" aria-labelledby="titre-autres">
            <h2 id="titre-autres" className="text-2xl font-bold sm:text-3xl">
              Autres voitures disponibles
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => (
                <VehicleCard key={o.id} vehicle={o} whatsapp={settings.whatsapp} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{name}</p>
            {v.priceDay != null && (
              <p className="text-sm text-muted">
                <strong className="text-ink">{formatChf(v.priceDay)} CHF</strong> / jour
              </p>
            )}
          </div>
          {v.available ? (
            <>
              <a href="#reserver" className="btn-outline min-h-12 px-4 text-sm">
                Dates
              </a>
              <a href={whatsappUrl(settings.whatsapp, bookingMessage({ vehicle: name }))} target="_blank" rel="noopener" className="btn-wa min-h-12 px-4 text-sm">
                <WhatsAppIcon width={18} height={18} /> Réserver
              </a>
            </>
          ) : (
            <Link href="/voitures" className="btn-dark min-h-12 px-4 text-sm">
              Autres voitures
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
