import type { NextConfig } from "next";

const legacy: [string, string][] = [
  ["/nouvel-inventaire", "/voitures"],
  ["/contact-7", "/voitures/ford-ka"],
  ["/copie-de-ford-ka", "/voitures/citroen-c1"],
  ["/copie-de-daihatsu-cuore", "/voitures/peugeot-107"],
  ["/copie-de-citroen-c1", "/voitures/daihatsu-cuore"],
  ["/copie-de-peugeot-107", "/voitures/ford-fiesta"],
  ["/contact", "/#contact"],
  ["/mentions-l%C3%A9gales", "/mentions-legales"],
  ["/politique-de-confidentialit%C3%A9", "/confidentialite"],
  ["/politique-de-cookies", "/confidentialite"],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["better-sqlite3", "sharp"],
  async redirects() {
    return legacy.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
