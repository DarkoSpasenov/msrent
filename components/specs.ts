export function transmissionLabel(t: "manual" | "automatic") {
  return t === "automatic" ? "Automatique" : "Manuelle";
}

export function formatChf(n: number) {
  return new Intl.NumberFormat("fr-CH").format(n);
}

export function formatKm(n: number) {
  return `${new Intl.NumberFormat("fr-CH").format(n)} km`;
}
