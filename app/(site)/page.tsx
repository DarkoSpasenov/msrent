import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Contact";
import { HowItWorks } from "@/components/HowItWorks";
import { JsonLd, businessJsonLd } from "@/components/JsonLd";
import { QuickBook } from "@/components/QuickBook";
import { VehicleCard } from "@/components/VehicleCard";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { ArrowRightIcon, BoltIcon, CalendarIcon, ShieldIcon, TagIcon } from "@/components/icons";
import { photoSrc, photoSrcSet } from "@/lib/photo";
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
  { icon: CalendarIcon, title: "Location flexible", text: "À la journée, à la semaine ou au mois." },
  { icon: ShieldIcon, title: "Véhicules entretenus", text: "Des véhicules fiables et régulièrement entretenus." },
  { icon: TagIcon, title: "Tarifs transparents", text: "Les prix et kilomètres inclus sont affichés clairement." },
  { icon: BoltIcon, title: "Réservation rapide", text: "Contact direct avec MS Rent via WhatsApp." },
];

export default function HomePage() {
  const settings = getSettings();
  const vehicles = listVehicles();
  const wa = whatsappUrl(settings.whatsapp, bookingMessage({}));
  const available = vehicles.filter((v) => v.available);
  const prices = available.map((v) => v.priceDay).filter((p): p is number => p != null);
  const fromPrice = prices.length ? Math.min(...prices) : null;
  const featured = available.find((v) => v.photos[0]?.transparent) ?? available.find((v) => v.photos[0]);

  return (
    <>
      <JsonLd data={businessJsonLd(settings, fromPrice)} />

      {/* Hero */}
      <section className="container-x pt-2 sm:pt-4">
        <div className="relative overflow-hidden rounded-[32px] bg-brand sm:rounded-[44px]">
          <div className="pointer-events-none absolute -right-24 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/25" aria-hidden="true" />
          <div className="relative grid items-center gap-6 px-6 pt-10 pb-28 sm:px-12 sm:pt-16 sm:pb-36 lg:grid-cols-[1.1fr_1fr] lg:gap-4 lg:px-16 lg:pt-20 lg:pb-40">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
                Location de voitures · Yverdon-les-Bains
              </p>
              <h1 className="mt-5 text-[44px] leading-[0.98] font-extrabold sm:text-7xl lg:text-[84px]">Louez votre voiture simplement.</h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed font-medium text-ink/75">
                Des véhicules fiables à Yverdon-les-Bains, disponibles à la journée, à la semaine ou au mois.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
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

            {settings.heroImage ? (
              <img
                src={photoSrc(settings.heroImage, 1600)}
                srcSet={photoSrcSet(settings.heroImage)}
                sizes="(min-width: 1024px) 560px, 100vw"
                alt=""
                fetchPriority="high"
                className="aspect-[4/3] w-full rounded-[28px] object-cover"
              />
            ) : (
              featured && (
                <Link href={`/voitures/${featured.slug}/`} className="relative block lg:-mr-6" aria-label={`Voir la ${vehicleName(featured)}`}>
                  <VehiclePhoto
                    photo={featured.photos[0]}
                    alt={vehicleName(featured)}
                    sizes="(min-width: 1024px) 600px, 100vw"
                    priority
                    className={`aspect-[16/10] w-full ${featured.photos[0].transparent ? "!p-0" : "rounded-[28px]"}`}
                  />
                </Link>
              )
            )}
          </div>
        </div>

        {/* Quick booking, overlapping the hero */}
        <div className="relative z-10 -mt-20 px-2 sm:-mt-24 sm:px-8 lg:px-12">
          <QuickBook cars={available.map((v) => ({ name: vehicleName(v), priceDay: v.priceDay }))} whatsapp={settings.whatsapp} />
        </div>
      </section>

      {/* Vehicles */}
      <section id="voitures" className="pt-20 pb-6 sm:pt-28" aria-labelledby="titre-voitures">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="kicker">Nos voitures</span>
              <h2 id="titre-voitures" className="mt-4 text-4xl font-extrabold sm:text-5xl">
                Choisissez votre voiture
              </h2>
            </div>
            <p className="max-w-sm text-muted">Prix par jour, kilomètres inclus. Tarifs à la semaine et au mois sur chaque fiche.</p>
          </div>
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

      {/* Why MS Rent */}
      <section className="pb-20 sm:pb-28" aria-labelledby="titre-pourquoi">
        <div className="container-x">
          <div className="rounded-[36px] bg-cloud p-7 sm:p-12 lg:p-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
              <div>
                <span className="kicker bg-white">Pourquoi MS Rent</span>
                <h2 id="titre-pourquoi" className="mt-4 text-4xl font-extrabold sm:text-5xl">
                  Simple, clair, sans surprise.
                </h2>
                <p className="mt-5 leading-relaxed text-muted">
                  Pour un besoin personnel ou professionnel, MS Rent vous loue une voiture bien entretenue à un tarif compétitif, avec un contact
                  direct et rapide.
                </p>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {WHY.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-3xl bg-white p-6">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand">
                      <Icon />
                    </span>
                    <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Contact settings={settings} whatsappHref={wa} />
    </>
  );
}
