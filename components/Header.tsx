"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/voitures/", label: "Nos voitures" },
  { href: "/#comment-ca-marche", label: "Comment ça marche" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link href="/" aria-label="MS Rent, accueil" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center rounded-2xl bg-cloud p-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : item.href.startsWith("/voitures") && pathname.startsWith("/voitures");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-[15px] font-semibold transition-colors ${active ? "bg-white text-ink shadow-soft" : "text-muted hover:text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappHref} target="_blank" rel="noopener" className="btn-wa hidden min-h-11 px-4 text-sm sm:inline-flex">
            <WhatsAppIcon width={18} height={18} />
            Réserver
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-cloud lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="fixed inset-x-0 top-[72px] bottom-0 bg-white lg:hidden" aria-label="Navigation mobile">
          <ul className="container-x flex flex-col gap-2 pt-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-2xl bg-cloud px-5 py-4 font-display text-2xl font-bold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
