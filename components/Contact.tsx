import { InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/settings";
import { telHref } from "@/lib/settings";
import { SITE } from "@/lib/site";

export function Contact({ settings, whatsappHref }: { settings: SiteSettings; whatsappHref: string }) {
  const rows = [
    { icon: <PinIcon />, label: "Adresse", value: `${SITE.postalCode} ${SITE.city}`, href: undefined },
    settings.email && { icon: <MailIcon />, label: "E-mail", value: settings.email, href: `mailto:${settings.email}` },
    settings.instagram && { icon: <InstagramIcon />, label: "Instagram", value: `@${settings.instagram}`, href: `https://www.instagram.com/${settings.instagram}/` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[];

  return (
    <section id="contact" className="pb-20 sm:pb-28" aria-labelledby="titre-contact">
      <div className="container-x">
        <div className="grid gap-8 rounded-[36px] bg-brand p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:gap-12 lg:p-16">
          <div>
            <h2 id="titre-contact" className="text-4xl font-extrabold sm:text-5xl">
              Une question ?
            </h2>
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
          <address className="flex flex-col justify-center gap-4 not-italic lg:pr-6">
            {rows.map((r) => {
              const inner = (
                <>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/60">{r.icon}</span>
                  <span className="sr-only">{r.label} : </span>
                  <span className="font-bold [overflow-wrap:anywhere]">{r.value}</span>
                </>
              );
              return r.href ? (
                <a
                  key={r.label}
                  href={r.href}
                  className="flex items-center gap-3 hover:underline"
                  {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                >
                  {inner}
                </a>
              ) : (
                <div key={r.label} className="flex items-center gap-3">
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
