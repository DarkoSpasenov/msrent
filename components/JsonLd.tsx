import type { SiteSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";
import type { Vehicle } from "@/lib/vehicles";
import { vehicleName } from "@/lib/vehicles";
import { photoSrc } from "@/lib/photo";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

function intlPhone(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.startsWith("0") ? `+41 ${d.slice(1, 3)} ${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}` : phone;
}

/** Only facts confirmed by the former site: no street address, opening hours or ratings. */
export function businessJsonLd(settings: SiteSettings, fromPrice: number | null) {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    ...(settings.phone && { telephone: intlPhone(settings.phone) }),
    ...(settings.email && { email: settings.email }),
    address: {
      "@type": "PostalAddress",
      postalCode: SITE.postalCode,
      addressLocality: SITE.city,
      addressRegion: "VD",
      addressCountry: SITE.country,
    },
    areaServed: [{ "@type": "City", name: SITE.city }, { "@type": "State", name: SITE.region }],
    ...(fromPrice != null && { priceRange: `Dès ${fromPrice} CHF / jour` }),
    currenciesAccepted: "CHF",
    ...(settings.instagram && { sameAs: [`https://www.instagram.com/${settings.instagram}/`] }),
  };
}

export function vehicleJsonLd(v: Vehicle) {
  const name = vehicleName(v);
  const offers = [
    v.priceDay != null && { price: v.priceDay, unit: "DAY", km: v.kmDay },
    v.priceWeek != null && { price: v.priceWeek, unit: "WEE", km: v.kmWeek },
    v.priceMonth != null && { price: v.priceMonth, unit: "MON", km: v.kmMonth },
  ].filter(Boolean) as { price: number; unit: string; km: number | null }[];
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    brand: { "@type": "Brand", name: v.brand },
    model: v.model,
    url: `${SITE.url}/voitures/${v.slug}`,
    ...(v.photos.length && { image: v.photos.map((p) => `${SITE.url}${photoSrc(p.file, 1600)}`) }),
    vehicleTransmission: v.transmission === "automatic" ? "Automatique" : "Manuelle",
    seatingCapacity: v.seats,
    numberOfDoors: v.doors,
    offers: offers.map((o) => ({
      "@type": "Offer",
      priceCurrency: "CHF",
      price: o.price,
      availability: v.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      priceSpecification: { "@type": "UnitPriceSpecification", price: o.price, priceCurrency: "CHF", unitCode: o.unit },
      ...(o.km != null && { description: `${o.km} km inclus` }),
      seller: { "@id": `${SITE.url}/#business` },
    })),
  };
}
