"use client";

import { usePathname } from "next/navigation";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";

/** Mobile: fixed call / WhatsApp bar. Desktop: floating WhatsApp button. */
export function ContactBar({ whatsappHref, telHref }: { whatsappHref: string; telHref: string }) {
  // Vehicle pages have their own booking bar on mobile.
  const onVehiclePage = /^\/voitures\/[^/]+/.test(usePathname());
  return (
    <>
      <div className={`${onVehiclePage ? "hidden" : ""} fixed inset-x-0 bottom-0 z-30 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgb(10_15_31/0.2)] backdrop-blur md:hidden`}>
        <div className="flex gap-2">
          <a href={telHref} className="btn-outline min-h-13 w-14 shrink-0 px-0" aria-label="Appeler MS Rent">
            <PhoneIcon />
          </a>
          <a href={whatsappHref} target="_blank" rel="noopener" className="btn-wa min-h-13 flex-1 text-base">
            <WhatsAppIcon /> Réserver sur WhatsApp
          </a>
        </div>
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label="Réserver sur WhatsApp"
        className="fixed right-6 bottom-6 z-30 hidden h-16 w-16 place-items-center rounded-full bg-wa text-ink shadow-float transition-transform hover:scale-105 md:grid"
      >
        <WhatsAppIcon width={30} height={30} />
      </a>
    </>
  );
}
