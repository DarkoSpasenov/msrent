export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.ADMIN_PASSWORD) console.warn("[msrent] ADMIN_PASSWORD n'est pas défini : l'administration est désactivée.");
  // Fetch the former site's photos in the background on first start.
  const { importLegacyPhotos, pendingLegacyCount } = await import("@/lib/importer");
  if (pendingLegacyCount() > 0) {
    importLegacyPhotos()
      .then((r) => console.log(`[msrent] Import des photos de l'ancien site : ${r.imported} importée(s), ${r.failed} échec(s).`))
      .catch((e) => console.warn("[msrent] Import des photos impossible :", e));
  }
}
