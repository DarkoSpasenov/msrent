import type { Metadata } from "next";
import { VehicleCard } from "@/components/VehicleCard";
import { getSettings } from "@/lib/settings";
import { OG_IMAGE } from "@/lib/site";
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
    <section className="pt-10 pb-16 sm:pt-16 sm:pb-24">
      <div className="container-x">
        <p className="eyebrow">Location de voiture · Yverdon-les-Bains</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Nos voitures</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          {availableCount > 0
            ? `${availableCount} voiture${availableCount > 1 ? "s" : ""} disponible${availableCount > 1 ? "s" : ""}. Prix par jour avec kilomètres inclus, tarifs à la semaine et au mois sur chaque fiche.`
            : "Contactez-nous sur WhatsApp pour connaître les prochaines disponibilités."}
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} whatsapp={settings.whatsapp} priority={i < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
