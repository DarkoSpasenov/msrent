import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-4 text-center">
      <div>
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <h1 className="mt-10 text-4xl font-extrabold">Page introuvable</h1>
        <p className="mt-3 text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/voitures/" className="btn-ink">
            Voir nos voitures
          </Link>
          <Link href="/" className="btn-outline">
            Accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
