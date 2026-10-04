import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { photoSrc } from "@/lib/photo";
import { readUpload } from "@/lib/upload";
import { addPhoto, getVehicle, reorderPhotos } from "@/lib/vehicles";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const id = Number((await params).id);
  if (!getVehicle(id)) return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
  const result = await readUpload(req, "p");
  if (result instanceof Response) return result;
  const photo = addPhoto(id, result);
  revalidatePath("/", "layout");
  return Response.json({ photo: { ...photo, preview: photoSrc(photo.file, 480) } });
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const id = Number((await params).id);
  if (!getVehicle(id)) return Response.json({ error: "Véhicule introuvable" }, { status: 404 });
  const body = (await req.json().catch(() => null)) as { order?: unknown } | null;
  const order = Array.isArray(body?.order) ? body.order.map(Number).filter(Number.isInteger) : null;
  if (!order) return Response.json({ error: "Ordre invalide" }, { status: 400 });
  reorderPhotos(id, order);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
