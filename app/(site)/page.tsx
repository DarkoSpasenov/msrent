import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Contact";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd, businessJsonLd } from "@/components/JsonLd";
import { QuickBook } from "@/components/QuickBook";
import { VehicleCard } from "@/components/VehicleCard";
import { ArrowRightIcon, BoltIcon, CalendarIcon, RouteIcon, ShieldIcon } from "@/components/icons";
import { getSettings } from "@/lib/settings";
import { OG_IMAGE } from "@/lib/site";
import { toneAt } from "@/lib/tone";
import { listVehicles, vehicleName } from "@/lib/vehicles";
import { bookingMessage, whatsappUrl } from "@/lib/whatsapp";

export function generateMetadata(): Metadata {
  const prices = listVehicles()
    .filter((v) => v.available && v.priceDay != null)
    .map((v) => v.priceDay!);
  const from = prices.length ? ` dès ${Math.min(...prices)} CHF par jour` : "";
  const description = `Location de voitures à Yverdon-les-Bains${from}, kilomètres inclus. À la journée, à la semaine ou au mois. Réservation rapide par WhatsApp.`;
  return { description, alternates: { canonical: "/" }, openGraph: { url: "/", description, images: [OG_IMAGE] } };
}

const WHY = [
  { icon: CalendarIcon, title: "Jour, semaine ou mois" },
  { icon: RouteIcon, title: "Kilomètres inclus" },
  { icon: ShieldIcon, title: "Voitures entretenues" },
  { icon: BoltIcon, title: "Sans paiement en ligne" },
];

export default function HomePage() {
  const settings = getSettings();
  const vehicles = listVehicles();
  const wa = whatsappUrl(settings.whatsapp, bookingMessage({}));
  const available = vehicles.filter((v) => v.available);
  const prices = available.map((v) => v.priceDay).filter((p): p is number => p != null);
  const fromPrice = prices.length ? Math.min(...prices) : null;

  return (
    <>
      <JsonLd data={businessJsonLd(settings, fromPrice)} />

      {/* Hero */}
      <section className="container-x pt-2 sm:pt-4">
        <div className="relative overflow-hidden rounded-[32px] bg-brand sm:rounded-[44px]">
          <div className="pointer-events-none absolute -right-24 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/25" aria-hidden="true" />
          <div className="relative px-6 pt-10 pb-28 sm:px-12 sm:pt-14 sm:pb-32 lg:px-16 lg:pt-16 lg:pb-32">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                Yverdon-les-Bains
              </p>
              <h1 className="mt-5 text-[44px] leading-[0.98] font-extrabold sm:text-7xl lg:text-[84px]">Louez votre voiture simplement.</h1>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Link href="/voitures/" className="btn-ink text-base">
                  Voir les voitures <ArrowRightIcon width={18} height={18} />
                </Link>
                {fromPrice != null && (
                  <p className="text-sm font-semibold text-ink/70">
                    Dès <span className="font-display text-2xl font-extrabold text-ink">{fromPrice} CHF</span> / jour
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick booking, overlapping the hero */}
        <div className="relative z-10 -mt-20 px-2 sm:-mt-24 sm:px-8 lg:px-12">
          <QuickBook cars={available.map((v) => ({ name: vehicleName(v), priceDay: v.priceDay }))} whatsapp={settings.whatsapp} />
        </div>

        {/* Why MS Rent */}
        <h2 className="sr-only">Pourquoi MS Rent</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-5 px-2 sm:px-8 lg:grid-cols-4 lg:px-12">
          {WHY.map(({ icon: Icon, title }) => (
            <li key={title} className="flex items-center gap-3 text-[15px] leading-snug font-bold">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-ink">
                <Icon width={20} height={20} />
              </span>
              {title}
            </li>
          ))}
        </ul>
      </section>

      {/* Vehicles */}
      <section id="voitures" className="pt-16 pb-6 sm:pt-24" aria-labelledby="titre-voitures">
        <div className="container-x">
          <h2 id="titre-voitures" className="text-4xl font-extrabold sm:text-5xl">
            Nos voitures
          </h2>
          {vehicles.length ? (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v, i) => (
                <VehicleCard key={v.slug} vehicle={v} whatsapp={settings.whatsapp} tone={toneAt(i)} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-3xl bg-cloud p-8 text-muted">
              Notre flotte est en cours de mise à jour. Contactez-nous sur WhatsApp pour connaître les disponibilités.
            </p>
          )}
        </div>
      </section>

      <HowItWorks />

      <Contact settings={settings} whatsappHref={wa} />
    </>
  );
}
