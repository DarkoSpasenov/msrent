export const SITE = {
  name: "MS Rent",
  city: "Yverdon-les-Bains",
  postalCode: "1400",
  region: "Vaud",
  country: "CH",
  /** Public address including any base path, without trailing slash. */
  url: (process.env.SITE_URL || "https://www.msrent.ch").replace(/\/$/, ""),
  /** Scheme + host only, for paths that already include the base path. */
  origin: new URL(process.env.SITE_URL || "https://www.msrent.ch").origin,
};

export const OG_IMAGE = {
  url: `${SITE.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ""}/og.png`,
  width: 1200,
  height: 630,
  alt: "MS Rent, location de voitures à Yverdon-les-Bains",
};
