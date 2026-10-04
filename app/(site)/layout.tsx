import { ContactBar } from "@/components/ContactBar";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSettings, telHref } from "@/lib/settings";
import { listVehicles, vehicleName } from "@/lib/vehicles";
import { bookingMessage, whatsappUrl } from "@/lib/whatsapp";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const cars = listVehicles().map((v) => ({ slug: v.slug, name: vehicleName(v) }));
  const wa = whatsappUrl(settings.whatsapp, bookingMessage({}));
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Aller au contenu
      </a>
      <Header whatsappHref={wa} />
      <main id="contenu">{children}</main>
      <Footer settings={settings} cars={cars} whatsappHref={wa} />
      <ContactBar whatsappHref={wa} telHref={telHref(settings.phone)} />
    </>
  );
}
