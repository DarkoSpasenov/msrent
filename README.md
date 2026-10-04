# MS Rent — site de location de voitures

Site de MS Rent (Yverdon-les-Bains) : catalogue de voitures, fiche véhicule, demande de réservation
par WhatsApp avec message prérempli, et administration simple pour gérer les véhicules.

- **Next.js 16** (App Router), React 19, Tailwind CSS 4
- **SQLite** (fichier unique, aucune base à installer) via better-sqlite3
- **Photos** optimisées automatiquement (WebP 480 / 960 / 1600 px, orientation corrigée, métadonnées GPS supprimées)
- **Administration** sur `/admin`, protégée par mot de passe

## Démarrage rapide

```bash
npm install
cp .env.example .env      # puis remplir ADMIN_PASSWORD et SESSION_SECRET
npm run build
npm start                 # http://localhost:3000
```

Au premier démarrage, la base est créée dans `data/` avec les 5 véhicules de l'ancien site
(Ford KA, Citroën C1, Peugeot 107, Daihatsu Cuore, Ford Fiesta), leurs tarifs et kilomètres inclus,
ainsi que les coordonnées (téléphone, e-mail, Instagram, WhatsApp 41764651412).

Les photos de l'ancien site Wix sont téléchargées et optimisées **automatiquement au premier démarrage**
du serveur. Si le serveur n'a pas pu les récupérer, un bouton « Importer maintenant » apparaît dans
l'administration. L'image de fond de l'ancien site est proposée dans *Paramètres → Image d'accueil*.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `ADMIN_PASSWORD` | Mot de passe de `/admin` (obligatoire, long). Le changer déconnecte tous les appareils. |
| `SESSION_SECRET` | Chaîne aléatoire pour signer la session (`openssl rand -hex 32`). |
| `SITE_URL` | Adresse publique, ex. `https://www.msrent.ch` (SEO, sitemap, Open Graph). |
| `DATA_DIR` | Dossier persistant pour la base et les photos. Par défaut `./data`. |

**Important :** le dossier `DATA_DIR` contient toute la base et toutes les photos. Il doit être
persistant (pas effacé à chaque déploiement) et sauvegardé régulièrement.

## Mise en ligne

Le site a besoin d'un hébergement **Node.js 20 ou plus** avec un dossier persistant :

- **Hébergement avec Node.js** (ex. Infomaniak, offre Node.js) : envoyer le code, `npm install`,
  `npm run build`, commande de démarrage `npm start`, définir les variables ci-dessus et un `DATA_DIR`
  hors du dossier de déploiement.
- **Serveur / VPS avec Docker** :
  ```bash
  docker build -t msrent .
  docker run -d --name msrent -p 3000:3000 -v /srv/msrent-data:/data \
    -e ADMIN_PASSWORD=... -e SESSION_SECRET=... -e SITE_URL=https://www.msrent.ch msrent
  ```
  puis un reverse proxy HTTPS (Caddy, Nginx) devant le port 3000.

Un hébergement « serverless » sans disque persistant (Vercel, Netlify) ne convient pas tel quel,
car la base SQLite et les photos sont stockées sur le disque.

### Bascule depuis Wix

1. Mettre le nouveau site en ligne sur une adresse de test et vérifier l'import des photos.
2. Pointer le domaine `msrent.ch` vers le nouvel hébergement.
3. Les anciennes adresses Wix redirigent automatiquement (301) vers les nouvelles :
   `/nouvel-inventaire` → `/voitures`, `/contact-7` → `/voitures/ford-ka`, etc. (voir `next.config.ts`).
4. Déclarer `https://www.msrent.ch/sitemap.xml` dans Google Search Console.

## Administration (pour le propriétaire)

- `/admin` → mot de passe.
- **+ Ajouter un véhicule** : marque, modèle, transmission, places, portes, prix et km inclus
  (jour / semaine / mois), photos, description, statut. **Publier le véhicule** : il apparaît
  immédiatement sur l'accueil, la page Nos voitures et sa propre page (`/voitures/marque-modele`).
- **Switch Disponible / Indisponible** dans la liste : un véhicule indisponible reste visible avec
  « Actuellement indisponible » et sa réservation est désactivée.
- **Photos** : ajout multiple, suppression, « Principale » pour choisir la photo principale, flèches
  pour réorganiser. Les photos de téléphone sont réduites avant l'envoi.
- Flèches haut / bas dans la liste : ordre d'affichage des véhicules.
- **Paramètres** : numéro WhatsApp, téléphone, e-mail, Instagram, image d'accueil.

## Structure

```
app/(site)/          pages publiques (accueil, /voitures, /voitures/[slug], pages légales)
app/admin/           administration (connexion, véhicules, paramètres) et actions serveur
app/api/admin/       envoi / suppression / ordre des photos
app/media/           service des photos optimisées
lib/                 base de données, véhicules, réglages, auth, images, message WhatsApp
seed/                données reprises de l'ancien site (première installation)
```
