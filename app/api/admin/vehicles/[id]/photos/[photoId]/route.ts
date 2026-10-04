import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { removeImageFiles } from "@/lib/images";
import { deletePhoto } from "@/lib/vehicles";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string; photoId: string }> }) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id, photoId } = await params;
  const file = deletePhoto(Number(id), Number(photoId));
  if (!file) return Response.json({ error: "Photo introuvable" }, { status: 404 });
  await removeImageFiles(file);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
