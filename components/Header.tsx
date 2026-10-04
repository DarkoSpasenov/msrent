"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/voitures", label: "Nos voitures" },
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
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-18">
        <Link href="/" className="shrink-0" aria-label="MS Rent, accueil">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = item.href === pathname || (item.href === "/voitures" && pathname.startsWith("/voitures"));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${active ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={whatsappHref} target="_blank" rel="noopener" className="btn-wa min-h-10 px-4 text-sm sm:min-h-11 sm:px-5">
            <WhatsAppIcon width={18} height={18} />
            <span>
              <span className="hidden sm:inline">WhatsApp · </span>Réserver
            </span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-line bg-paper lg:hidden" aria-label="Navigation mobile">
          <ul className="container-x flex h-[calc(100dvh-4rem)] flex-col gap-1 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-4 font-display text-2xl font-bold hover:bg-mist"
                >
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
