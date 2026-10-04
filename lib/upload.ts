import "server-only";
import { MAX_UPLOAD_BYTES, processImage, type ProcessedImage } from "@/lib/images";

/** Reads the "file" field of a multipart request and optimizes it. */
export async function readUpload(req: Request, prefix: string): Promise<ProcessedImage | Response> {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_UPLOAD_BYTES + 1024 * 64) return Response.json({ error: "Photo trop lourde (25 Mo maximum)." }, { status: 413 });
  let file: FormDataEntryValue | null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return Response.json({ error: "Envoi invalide." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) return Response.json({ error: "Aucune photo reçue." }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) return Response.json({ error: "Photo trop lourde (25 Mo maximum)." }, { status: 413 });
  try {
    return await processImage(Buffer.from(await file.arrayBuffer()), prefix);
  } catch {
    return Response.json({ error: "Format non reconnu. Utilisez une photo JPG, PNG ou WebP." }, { status: 415 });
  }
}
