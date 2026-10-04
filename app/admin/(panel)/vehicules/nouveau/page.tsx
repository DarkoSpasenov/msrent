import { VehicleForm } from "@/app/admin/(panel)/VehicleForm";

export const metadata = { title: "Ajouter un véhicule" };

export default function NewVehiclePage() {
  return (
    <VehicleForm
      initial={{
        id: null,
        brand: "",
        model: "",
        transmission: "manual",
        seats: 5,
        doors: 5,
        priceDay: null,
        kmDay: 100,
        priceWeek: null,
        kmWeek: 400,
        priceMonth: null,
        kmMonth: 1500,
        description: "",
        available: true,
        photos: [],
      }}
    />
  );
}
