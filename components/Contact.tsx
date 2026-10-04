import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function Contact({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  const rows = [
    { icon: <PinIcon />, label: "Adresse", value: `${SITE.postalCode} ${SITE.city}`, href: undefined },
    settings.phone && { icon: <PhoneIcon />, label: "Téléphone", value: settings.phone, href: telHref(settings.phone) },
    settings.email && { icon: <MailIcon />, label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && {
      icon: <InstagramIcon />,
      label: "Instagram",
      value: `@${settings.instagram}`,
      href: `https://www.instagram.com/${settings.instagram}/`,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="py-16 sm:py-24" aria-labelledby="titre-contact">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-[1.75rem] bg-ink text-white lg:grid-cols-[1.1fr_1fr]">
          <div className="p-7 sm:p-12">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/50 uppercase">Contact</p>
            <h2 id="titre-contact" className="mt-3 text-3xl font-bold sm:text-4xl">
              Une question ? Écrivez-nous.
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">
              Le plus rapide est WhatsApp : indiquez la voiture et vos dates, nous vous confirmons la disponibilité et le tarif.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener" className="btn-wa">
                <WhatsAppIcon /> Écrire sur WhatsApp
              </a>
              {settings.phone && (
                <a href={telHref(settings.phone)} className="btn-ghost-light">
                  <PhoneIcon width={18} height={18} /> Appeler
                </a>
              )}
            </div>
          </div>
          <address className="border-t border-white/10 p-7 not-italic sm:p-12 lg:border-t-0 lg:border-l">
            <p className="font-display text-xl font-bold">MS Rent</p>
            <ul className="mt-6 space-y-5">
              {rows.map((r) => (
                <li key={r.label} className="flex items-start gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/8 text-white/80">{r.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-xs tracking-wide text-white/45 uppercase">{r.label}</span>
                    {r.href ? (
                      <a href={r.href} className="block break-words text-white hover:underline" {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                        {r.value}
                      </a>
                    ) : (
                      <span className="block text-white">{r.value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </address>
        </div>
      </div>
    </section>
  );
}
