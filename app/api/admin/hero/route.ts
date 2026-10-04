import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { removeImageFiles } from "@/lib/images";
import { getSetting, setSetting } from "@/lib/settings";
import { readUpload } from "@/lib/upload";

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const result = await readUpload(req, "site");
  if (result instanceof Response) return result;
  const previous = getSetting("hero_image");
  setSetting("hero_image", result.file);
  if (previous) await removeImageFiles(previous);
  revalidatePath("/", "layout");
  return Response.json({ ok: true });
}
