import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { Logo } from "@/components/Logo";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo compact />
            <span className="hidden rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-muted sm:inline">Admin</span>
          </Link>
          <nav className="flex items-center text-sm font-medium sm:gap-1">
            <Link href="/admin" className="rounded-full px-2.5 py-2 sm:px-3 hover:bg-mist">
              Véhicules
            </Link>
            <Link href="/admin/parametres" className="rounded-full px-2.5 py-2 sm:px-3 hover:bg-mist">
              Paramètres
            </Link>
            <a href="/" target="_blank" className="hidden rounded-full px-2.5 py-2 sm:px-3 hover:bg-mist sm:inline">
              Voir le site
            </a>
            <form action={logout}>
              <button type="submit" className="rounded-full px-2.5 py-2 sm:px-3 text-muted hover:bg-mist hover:text-ink">
                Quitter
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pt-6 pb-24 sm:pt-10">{children}</main>
    </>
  );
}
