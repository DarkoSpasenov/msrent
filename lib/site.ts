export const SITE = {
  name: "MS Rent",
  city: "Yverdon-les-Bains",
  postalCode: "1400",
  region: "Vaud",
  country: "CH",
  url: (process.env.SITE_URL || "https://www.msrent.ch").replace(/\/$/, ""),
};
