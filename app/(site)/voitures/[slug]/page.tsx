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
import { toneAt } from "@/lib/tone";
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
  const all = listVehicles();
  const tone = toneAt(all.findIndex((o) => o.slug === v.slug));
  const others = all
    .map((o, i) => ({ o, tone: toneAt(i) }))
    .filter(({ o }) => o.slug !== v.slug && o.available)
    .slice(0, 3);

  const rates = [
    { label: "Jour", price: v.priceDay, km: v.kmDay },
    { label: "Semaine", price: v.priceWeek, km: v.kmWeek },
    { label: "Mois", price: v.priceMonth, km: v.kmMonth },
  ].filter((r) => r.price != null);

  const specs = [
    { icon: GearboxIcon, label: "Transmission", value: transmissionLabel(v.transmission) },
    { icon: SeatIcon, label: "Places", value: String(v.seats) },
    { icon: DoorIcon, label: "Portes", value: String(v.doors) },
  ];

  return (
    <>
      <JsonLd data={vehicleJsonLd(v)} />
      <div className="container-x pt-4 pb-28 sm:pt-6 md:pb-24">
        <nav aria-label="Fil d'Ariane">
          <Link href="/voitures/" className="inline-flex items-center gap-1 rounded-xl bg-cloud px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
            <ChevronLeftIcon width={16} height={16} /> Nos voitures
          </Link>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <Gallery photos={v.photos} name={name} tone={v.available ? tone : "bg-cloud"} dimmed={!v.available} />
          </div>

          <div className="min-w-0">
            <h1 className="text-5xl font-extrabold sm:text-6xl">{name}</h1>
            {!v.available && (
              <p className="mt-4 inline-flex rounded-full bg-ink px-3.5 py-1.5 text-sm font-bold text-white">Indisponible pour le moment</p>
            )}
            {v.priceDay != null && (
              <p className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-5xl font-extrabold">{formatChf(v.priceDay)}</span>
                <span className="text-lg font-bold">CHF / jour</span>
              </p>
            )}

            <dl className="mt-6 flex flex-wrap gap-2">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 rounded-2xl bg-cloud px-4 py-2.5">
                  <Icon width={18} height={18} className="text-muted" />
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-bold">
                    {value}
                    {label === "Places" ? " places" : label === "Portes" ? " portes" : ""}
                  </dd>
                </div>
              ))}
            </dl>

            {rates.length > 0 && (
              <section className="mt-6" aria-labelledby="titre-tarifs">
                <h2 id="titre-tarifs" className="sr-only">
                  Tarifs
                </h2>
                <ul className="grid grid-cols-3 overflow-hidden rounded-3xl border-2 border-line">
                  {rates.map((r, i) => (
                    <li key={r.label} className={`p-3 sm:p-5 ${i > 0 ? "border-l-2 border-line" : ""}`}>
                      <span className="block text-xs font-bold tracking-wide text-muted uppercase">{r.label}</span>
                      <span className="mt-1 block font-display text-2xl font-extrabold sm:text-3xl">
                        {formatChf(r.price!)}
                        <span className="ml-1 text-sm font-bold">CHF</span>
                      </span>
                      {r.km != null && <span className="mt-0.5 block text-xs font-semibold text-muted sm:text-sm">{formatKm(r.km)} inclus</span>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-6">
              <BookingForm vehicle={name} whatsapp={settings.whatsapp} available={v.available} />
            </div>

            {v.description && (
              <div className="mt-8">
                <p className="leading-relaxed whitespace-pre-line text-muted">{v.description}</p>
              </div>
            )}
          </div>
        </div>

        {others.length > 0 && (
          <section className="mt-24" aria-labelledby="titre-autres">
            <h2 id="titre-autres" className="text-3xl font-extrabold sm:text-4xl">
              Autres voitures
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {others.map(({ o, tone }) => (
                <VehicleCard key={o.slug} vehicle={o} whatsapp={settings.whatsapp} tone={tone} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(17_18_20/0.2)] backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1 pl-1">
            <p className="truncate text-sm font-bold">{name}</p>
            {v.priceDay != null && (
              <p className="text-sm text-muted">
                <strong className="text-ink">{formatChf(v.priceDay)} CHF</strong> / jour
              </p>
            )}
          </div>
          {v.available ? (
            <>
              <a href="#reserver" className="btn-outline min-h-12 px-3.5 text-sm">
                Dates
              </a>
              <a href={whatsappUrl(settings.whatsapp, bookingMessage({ vehicle: name }))} target="_blank" rel="noopener" className="btn-wa min-h-12 px-4 text-sm">
                <WhatsAppIcon width={18} height={18} /> Réserver
              </a>
            </>
          ) : (
            <Link href="/voitures/" className="btn-ink min-h-12 px-4 text-sm">
              Autres voitures
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
