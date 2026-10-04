import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

// The vehicles are managed with Pages CMS, which edits the files of the GitHub repository.
const CMS_URL = "https://app.pagescms.org";

export default function AdminPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-cloud px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-[28px] bg-white p-6 shadow-soft sm:p-8">
          <h1 className="text-2xl font-bold">Administration</h1>
          <p className="mt-2 text-muted">
            Ajoutez, modifiez ou masquez les voitures, leurs photos et leurs tarifs. Les changements sont en ligne environ deux minutes après
            l&apos;enregistrement.
          </p>
          <a href={CMS_URL} className="btn-ink mt-6 w-full">
            Ouvrir l&apos;administration
          </a>
          <p className="mt-4 text-center text-xs text-muted">Connexion avec votre compte GitHub ou par lien reçu par e-mail.</p>
        </div>
      </div>
    </main>
  );
}
