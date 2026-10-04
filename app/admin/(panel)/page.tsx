import Link from "next/link";
import { ImportBanner } from "@/app/admin/(panel)/ImportBanner";
import { VehicleRow } from "@/app/admin/(panel)/VehicleRow";
import { pendingLegacyCount } from "@/lib/importer";
import { photoSrc } from "@/lib/photo";
import { listVehiclesAdmin, vehicleName } from "@/lib/vehicles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Véhicules" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  const vehicles = listVehiclesAdmin();
  const { ok } = await searchParams;
  const pending = vehicles.filter((v) => v.legacyPhotoUrl).length;
  return (
    <>
      {ok && (
        <p className="mb-6 rounded-2xl bg-wa-soft px-4 py-3 text-sm font-medium text-wa-dark" role="status">
          {ok === "deleted" ? "Véhicule supprimé." : "Véhicule enregistré. Il est en ligne sur le site."}
        </p>
      )}
      {pendingLegacyCount() > 0 && <ImportBanner count={pending} />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Véhicules</h1>
          <p className="mt-1 text-sm text-muted">
            {vehicles.length} véhicule{vehicles.length > 1 ? "s" : ""} · {vehicles.filter((v) => v.available).length} disponible
            {vehicles.filter((v) => v.available).length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/vehicules/nouveau" className="btn-dark w-full text-base sm:w-auto">
          <span className="text-xl leading-none">+</span> Ajouter un véhicule
        </Link>
      </div>

      <ul className="mt-6 space-y-3">
        {vehicles.map((v, i) => (
          <VehicleRow
            key={v.id}
            id={v.id}
            name={vehicleName(v)}
            slug={v.slug}
            priceDay={v.priceDay}
            available={v.available}
            thumb={v.photos[0] ? photoSrc(v.photos[0].file, 480) : null}
            photoCount={v.photos.length}
            first={i === 0}
            last={i === vehicles.length - 1}
          />
        ))}
      </ul>
      {vehicles.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          Aucun véhicule. Cliquez sur « Ajouter un véhicule » pour commencer.
        </p>
      )}
    </>
  );
}
