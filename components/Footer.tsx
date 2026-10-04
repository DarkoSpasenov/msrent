import Link from "next/link";
import { Logo } from "@/components/Logo";
import { InstagramIcon, MailIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function Footer({ settings, cars, whatsappHref }: { settings: SiteSettings; cars: { slug: string; name: string }[]; whatsappHref: string }) {
  return (
    <footer className="bg-ink pb-28 text-white/70 md:pb-0">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Location de voitures à {SITE.city}. À la journée, à la semaine ou au mois.
          </p>
          <p className="mt-4 text-sm">
            {SITE.name}
            <br />
            {SITE.postalCode} {SITE.city}
          </p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">Nos voitures</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {cars.map((c) => (
              <li key={c.slug}>
                <Link href={`/voitures/${c.slug}`} className="hover:text-white">
                  Location {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold tracking-[0.18em] text-white/45 uppercase">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={whatsappHref} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-white">
                <WhatsAppIcon width={16} height={16} /> WhatsApp
              </a>
            </li>
            {settings.phone && (
              <li>
                <a href={telHref(settings.phone)} className="inline-flex items-center gap-2 hover:text-white">
                  <PhoneIcon width={16} height={16} /> {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 break-all hover:text-white">
                  <MailIcon width={16} height={16} /> {settings.email}
                </a>
              </li>
            )}
            {settings.instagram && (
              <li>
                <a href={`https://www.instagram.com/${settings.instagram}/`} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-white">
                  <InstagramIcon width={16} height={16} /> @{settings.instagram}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MS Rent · Location de voiture à Yverdon-les-Bains</p>
          <nav className="flex gap-5" aria-label="Informations légales">
            <Link href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="hover:text-white">
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
