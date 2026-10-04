import type { Metadata } from "next";
import Link from "next/link";
import { Contact } from "@/components/Contact";
import { HowItWorks } from "@/components/HowItWorks";
import { VehicleCard } from "@/components/VehicleCard";
import { VehiclePhoto } from "@/components/VehiclePhoto";
import { ArrowRightIcon, BoltIcon, CalendarIcon, ShieldIcon, TagIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd, businessJsonLd } from "@/components/JsonLd";
import { photoSrc, photoSrcSet } from "@/lib/photo";
import { getSettings } from "@/lib/settings";
import { OG_IMAGE } from "@/lib/site";
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

const QUICK = [
  { icon: BoltIcon, label: "Réservation rapide" },
  { icon: TagIcon, label: "Tarifs transparents" },
  { icon: ShieldIcon, label: "Véhicules entretenus" },
  { icon: CalendarIcon, label: "Location flexible" },
];

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
  const featured = available.find((v) => v.photos[0]) ?? vehicles.find((v) => v.photos[0]);
  const featuredPhoto = featured?.photos[0];

  return (
    <>
      <JsonLd data={businessJsonLd(settings, fromPrice)} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {settings.heroImage ? (
          <>
            <img
              src={photoSrc(settings.heroImage, 1600)}
              srcSet={photoSrcSet(settings.heroImage)}
              sizes="100vw"
              alt=""
              fetchPriority="high"
              className="absolute inset-0 -z-10 h-full w-full object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/30" />
          </>
        ) : (
          <div
            className="absolute inset-0 -z-10 opacity-70"
            style={{ background: "radial-gradient(60% 60% at 75% 60%, rgb(255 255 255 / 0.10), transparent 70%)" }}
          />
        )}

        <div className="container-x grid items-center gap-8 pt-12 pb-10 sm:pt-20 sm:pb-16 lg:min-h-[560px] lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-white/55 uppercase">Location de voitures · Yverdon-les-Bains</p>
            <h1 className="mt-4 text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-[4.25rem]">Louez votre voiture simplement.</h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              Des véhicules fiables à Yverdon-les-Bains, disponibles à la journée, à la semaine ou au mois.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/voitures" className="btn-light">
                Voir les voitures <ArrowRightIcon width={18} height={18} />
              </Link>
              <a href={wa} target="_blank" rel="noopener" className="btn-wa">
                <WhatsAppIcon /> Réserver sur WhatsApp
              </a>
            </div>
            {fromPrice != null && (
              <p className="mt-6 text-sm text-white/55">
                Dès <strong className="font-semibold text-white">{fromPrice} CHF / jour</strong>, kilomètres inclus.
              </p>
            )}
          </div>

          {!settings.heroImage && featured && featuredPhoto && (
            <Link href={`/voitures/${featured.slug}`} className="relative block" aria-label={`Voir la ${vehicleName(featured)}`}>
              {featuredPhoto.transparent ? (
                <div className="relative mx-auto max-w-xl">
                  <div className="absolute inset-x-[8%] bottom-[6%] h-[18%] rounded-[100%] bg-black/60 blur-2xl" aria-hidden="true" />
                  <VehiclePhoto photo={featuredPhoto} alt={vehicleName(featured)} sizes="(min-width: 1024px) 560px, 100vw" priority className="relative aspect-[16/10] w-full !p-0" />
                </div>
              ) : (
                <VehiclePhoto
                  photo={featuredPhoto}
                  alt={vehicleName(featured)}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  priority
                  className="aspect-[16/10] w-full rounded-[1.5rem] lg:aspect-[5/4]"
                />
              )}
            </Link>
          )}
        </div>

        <div className="border-t border-white/10">
          <ul className="container-x grid grid-cols-2 gap-x-4 gap-y-3 py-5 text-sm text-white/80 sm:py-6 lg:grid-cols-4">
            {QUICK.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2.5">
                <Icon width={18} height={18} className="shrink-0 text-white/55" /> {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vehicles */}
      <section id="voitures" className="py-16 sm:py-24" aria-labelledby="titre-voitures">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Nos voitures</p>
              <h2 id="titre-voitures" className="mt-3 text-3xl font-bold sm:text-4xl">
                Choisissez votre voiture
              </h2>
            </div>
            <p className="max-w-sm text-muted">Prix par jour, kilomètres inclus. Tarifs à la semaine et au mois sur chaque fiche.</p>
          </div>
          {vehicles.length ? (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {vehicles.map((v, i) => (
                <VehicleCard key={v.id} vehicle={v} whatsapp={settings.whatsapp} priority={i === 0 && !!settings.heroImage} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-line bg-surface p-8 text-muted">
              Notre flotte est en cours de mise à jour. Contactez-nous sur WhatsApp pour connaître les disponibilités.
            </p>
          )}
        </div>
      </section>

      <HowItWorks />

      {/* Why MS Rent */}
      <section className="py-16 sm:py-24" aria-labelledby="titre-pourquoi">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <p className="eyebrow">Pourquoi MS Rent</p>
            <h2 id="titre-pourquoi" className="mt-3 text-3xl font-bold sm:text-4xl">
              Votre partenaire de confiance pour vos locations.
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Chez MS Rent, nous nous spécialisons dans la location de véhicules pour répondre à vos besoins, qu&apos;ils soient personnels ou
              professionnels. Notre engagement : un service de qualité, des voitures bien entretenues et des tarifs compétitifs.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            {WHY.map(({ icon: Icon, title, text }) => (
              <li key={title} className="bg-surface p-6 sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-mist">
                  <Icon />
                </span>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact settings={settings} whatsappHref={wa} />
    </>
  );
}
