import type { Metadata } from "next";
import { VehicleCard } from "@/components/VehicleCard";
import { getSettings } from "@/lib/settings";
import { OG_IMAGE } from "@/lib/site";
import { toneAt } from "@/lib/tone";
import { listVehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Nos voitures de location à Yverdon-les-Bains",
  description:
    "Toutes nos voitures de location à Yverdon-les-Bains : Ford, Citroën, Peugeot, Daihatsu. Prix par jour, semaine ou mois avec kilomètres inclus. Réservation par WhatsApp.",
  alternates: { canonical: "/voitures/" },
  openGraph: { url: "/voitures/", images: [OG_IMAGE] },
};

export default function VehiclesPage() {
  const settings = getSettings();
  const vehicles = listVehicles();
  const availableCount = vehicles.filter((v) => v.available).length;
  return (
    <section className="pt-8 pb-20 sm:pt-14 sm:pb-28">
      <div className="container-x">
        <h1 className="text-5xl font-extrabold sm:text-7xl">Nos voitures</h1>
        {availableCount === 0 && <p className="mt-4 text-lg text-muted">Contactez-nous sur WhatsApp pour les prochaines disponibilités.</p>}
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.slug} vehicle={v} whatsapp={settings.whatsapp} tone={toneAt(i)} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
