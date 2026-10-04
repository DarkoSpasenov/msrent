// GitHub Pages has no server redirects: write small redirect pages at the former Wix addresses.
import fs from "node:fs";
import path from "node:path";

const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
const map = {
  "nouvel-inventaire": "/voitures/",
  "contact-7": "/voitures/ford-ka/",
  "copie-de-ford-ka": "/voitures/citroen-c1/",
  "copie-de-daihatsu-cuore": "/voitures/peugeot-107/",
  "copie-de-citroen-c1": "/voitures/daihatsu-cuore/",
  "copie-de-peugeot-107": "/voitures/ford-fiesta/",
  contact: "/#contact",
  "mentions-légales": "/mentions-legales/",
  "politique-de-confidentialité": "/confidentialite/",
  "politique-de-cookies": "/confidentialite/",
};

for (const [from, to] of Object.entries(map)) {
  const target = `${base}${to}`;
  const dir = path.join("out", from);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "index.html"),
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Redirection</title><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}"><script>location.replace(${JSON.stringify(target)})</script></head><body><a href="${target}">Continuer</a></body></html>`,
  );
}
fs.writeFileSync("out/.nojekyll", "");
console.log("Redirections de l'ancien site créées.");
