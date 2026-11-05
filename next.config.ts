import type { NextConfig } from "next";

/**
 * Hosted on GitHub Pages as a fully static site (see README "Deployment").
 * Everything here must stay compatible with `output: "export"`: no server
 * redirects, no image optimizer, no runtime server features.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  // GitHub Pages serves /work/ from work/index.html, so emit directories.
  trailingSlash: true,
  // The Next.js image optimizer needs a server. Images are small, pre-sized
  // files in /public/media and are served as-is.
  images: { unoptimized: true },
};

export default nextConfig;
