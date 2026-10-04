import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default function Page() {
  const s = getSettings();
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        Cette politique explique comment MS Rent traite vos données personnelles, conformément à la loi fédérale sur la protection des
        données (LPD).
      </p>
      <h2>Données collectées par le site</h2>
      <p>
        Le site ne demande aucune création de compte et n&apos;enregistre pas les informations saisies dans le formulaire de réservation
        (dates, nom, téléphone). Ces informations servent uniquement à préparer votre message WhatsApp, que vous choisissez ou non
        d&apos;envoyer.
      </p>
      <h2>Messages WhatsApp, appels et e-mails</h2>
      <p>
        Lorsque vous nous contactez, nous utilisons vos coordonnées et les informations de votre demande uniquement pour y répondre et gérer
        votre location. Les messages WhatsApp sont transmis par le service WhatsApp (Meta), soumis à sa propre politique de confidentialité.
      </p>
      <h2>Cookies et mesure d&apos;audience</h2>
      <p>
        Le site public n&apos;utilise ni cookie publicitaire ni outil de mesure d&apos;audience. Un cookie technique est utilisé uniquement pour
        la connexion à l&apos;espace d&apos;administration.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en nous écrivant
        {s.email ? (
          <>
            {" "}
            à <a href={`mailto:${s.email}`}>{s.email}</a>
          </>
        ) : null}
        .
      </p>
    </LegalPage>
  );
}
