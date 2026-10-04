import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings, telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales/" } };

export default function Page() {
  const s = getSettings();
  return (
    <LegalPage title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        {SITE.name}
        <br />
        {SITE.postalCode} {SITE.city}, Suisse
        {s.phone && (
          <>
            <br />
            Téléphone : <a href={telHref(s.phone)}>{s.phone}</a>
          </>
        )}
        {s.email && (
          <>
            <br />
            E-mail : <a href={`mailto:${s.email}`}>{s.email}</a>
          </>
        )}
        {s.instagram && (
          <>
            <br />
            Instagram : <a href={`https://www.instagram.com/${s.instagram}/`}>@{s.instagram}</a>
          </>
        )}
      </p>
      <h2>Tarifs et réservations</h2>
      <p>
        Les tarifs affichés sont en francs suisses (CHF). Une demande envoyée par WhatsApp ne constitue pas une réservation : celle-ci est
        confirmée directement par MS Rent selon la disponibilité du véhicule.
      </p>
      <h2>Contenus et images</h2>
      <p>
        Les textes et la présentation de ce site appartiennent à MS Rent. Les images proviennent de plusieurs sources ; toute reproduction
        sans autorisation est interdite.
      </p>
      <h2>Responsabilité</h2>
      <p>
        MS Rent veille à l&apos;exactitude des informations publiées mais ne peut garantir l&apos;absence d&apos;erreur. La satisfaction de nos
        clients reste notre priorité : n&apos;hésitez pas à nous signaler toute inexactitude.
      </p>
    </LegalPage>
  );
}
