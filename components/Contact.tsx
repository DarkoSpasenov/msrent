import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function Contact({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  const rows = [
    { icon: <PinIcon />, label: "Adresse", value: `${SITE.postalCode} ${SITE.city}`, href: undefined },
    settings.phone && { icon: <PhoneIcon />, label: "Téléphone", value: settings.phone, href: telHref(settings.phone) },
    settings.email && { icon: <MailIcon />, label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && { icon: <InstagramIcon />, label: "Instagram", value: `@${settings.instagram}`, href: `https://www.instagram.com/${settings.instagram}/` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="pb-20 sm:pb-28" aria-labelledby="titre-contact">
      <div className="container-x">
        <div className="grid gap-8 rounded-[36px] bg-brand p-7 sm:p-12 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:p-16">
          <div>
            <h2 id="titre-contact" className="text-4xl font-extrabold sm:text-5xl">
              Une question ? Écrivez-nous.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink/75">
              Indiquez la voiture et vos dates sur WhatsApp : nous vous confirmons la disponibilité et le tarif.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappHref} target="_blank" rel="noopener" className="btn-ink text-base">
                <WhatsAppIcon className="text-wa" /> Écrire sur WhatsApp
              </a>
              {settings.phone && (
                <a href={telHref(settings.phone)} className="btn-white text-base">
                  <PhoneIcon width={18} height={18} /> {settings.phone}
                </a>
              )}
            </div>
          </div>
          <address className="grid gap-3 not-italic sm:grid-cols-2">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="text-ink/60">{r.icon}</span>
                  <span className="mt-4 block text-xs font-bold tracking-wide text-ink/55 uppercase">{r.label}</span>
                  <span className="mt-0.5 block font-bold [overflow-wrap:anywhere]">{r.value}</span>
                </>
              );
              return r.href ? (
                <a
                  key={r.label}
                  href={r.href}
                  className="rounded-3xl bg-white/60 p-5 transition-colors hover:bg-white"
                  {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                >
                  {inner}
                </a>
              ) : (
                <div key={r.label} className="rounded-3xl bg-white/60 p-5">
                  {inner}
                </div>
              );
            })}
          </address>
        </div>
      </div>
    </section>
  );
}
