import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function Footer({ settings, cars, whatsappHref }: { settings: SiteSettings; cars: { slug: string; name: string }[]; whatsappHref: string }) {
  return (
    <footer className="border-t border-line bg-cloud pb-28 md:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Location de voitures à {SITE.city}, à la journée, à la semaine ou au mois. {SITE.postalCode} {SITE.city}.
          </p>
        </div>
        <div>
          <h2 className="font-sans text-sm font-extrabold">Nos voitures</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {cars.map((c) => (
              <li key={c.slug}>
                <Link href={`/voitures/${c.slug}/`} className="hover:text-ink">
                  Location {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-sm font-extrabold">Contact</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener" className="hover:text-ink">
                WhatsApp
              </a>
            </li>
            {settings.phone && (
              <li>
                <a href={telHref(settings.phone)} className="hover:text-ink">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="break-all hover:text-ink">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.instagram && (
              <li>
                <a href={`https://www.instagram.com/${settings.instagram}/`} target="_blank" rel="noopener" className="hover:text-ink">
                  Instagram @{settings.instagram}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="container-x flex flex-col gap-3 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MS Rent · Location de voiture à Yverdon-les-Bains</p>
        <nav className="flex gap-5" aria-label="Informations légales">
          <Link href="/mentions-legales/" className="hover:text-ink">
            Mentions légales
          </Link>
          <Link href="/confidentialite/" className="hover:text-ink">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
