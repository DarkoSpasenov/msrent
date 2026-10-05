import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cloud pb-28 md:pb-0">
      <div className="container-x flex flex-col gap-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Logo />
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Informations légales">
          <Link href="/mentions-legales/" className="hover:text-ink">
            Mentions légales
          </Link>
          <Link href="/confidentialite/" className="hover:text-ink">
            Confidentialité
          </Link>
          <span>© {new Date().getFullYear()} MS Rent</span>
        </nav>
      </div>
    </footer>
  );
}
