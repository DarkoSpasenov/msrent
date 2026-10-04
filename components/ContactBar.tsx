"use client";

import { usePathname } from "next/navigation";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

/** Mobile: fixed call / WhatsApp bar. Desktop: floating WhatsApp button. */
export function ContactBar({ whatsappHref, telHref }: { whatsappHref: string; telHref: string }) {
  // Vehicle pages have their own booking bar on mobile.
  const onVehiclePage = /^\/voitures\/[^/]+/.test(usePathname());
  return (
    <>
      <div className={`${onVehiclePage ? "hidden" : ""} fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden`}>
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <a href={telHref} className="btn-outline min-h-12 px-3">
            <PhoneIcon width={18} height={18} />
            Appeler
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener" className="btn-wa min-h-12 px-3">
            <WhatsAppIcon />
            Réserver sur WhatsApp
          </a>
        </div>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="Réserver sur WhatsApp"
        className="fixed right-6 bottom-6 z-30 hidden h-14 items-center gap-2 rounded-full bg-wa pr-5 pl-4 font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5 hover:bg-wa-dark md:inline-flex"
      >
        <WhatsAppIcon width={24} height={24} />
        WhatsApp
      </a>
    </>
  );
}
