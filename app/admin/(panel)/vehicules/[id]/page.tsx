import { notFound } from "next/navigation";
import { VehicleForm } from "@/app/admin/(panel)/VehicleForm";
import { photoSrc } from "@/lib/photo";
import { getVehicle } from "@/lib/vehicles";

export const dynamic = "force-dynamic";
export const metadata = { title: "Modifier un véhicule" };

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const v = getVehicle(Number((await params).id));
  if (!v) notFound();
  return (
    <VehicleForm
      key={v.id}
      initial={{
        id: v.id,
        slug: v.slug,
        brand: v.brand,
        model: v.model,
        transmission: v.transmission,
        seats: v.seats,
        doors: v.doors,
        priceDay: v.priceDay,
        kmDay: v.kmDay,
        priceWeek: v.priceWeek,
        kmWeek: v.kmWeek,
        priceMonth: v.priceMonth,
        kmMonth: v.kmMonth,
        description: v.description,
        available: v.available,
        photos: v.photos.map((p) => ({ id: p.id, preview: photoSrc(p.file, 480) })),
      }}
    />
  );
}
