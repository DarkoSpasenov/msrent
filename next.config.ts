import type { NextConfig } from "next";

// Static site for GitHub Pages. NEXT_PUBLIC_BASE_PATH is "/msrent" on
// darkospasenov.github.io/msrent and empty once the msrent.ch domain is connected.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
