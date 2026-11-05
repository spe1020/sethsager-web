import type { NextConfig } from "next";
import { projects } from "./src/content/projects";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return projects
      .filter((project) => project.detailHref !== `/work/${project.slug}`)
      .map((project) => ({
        source: `/work/${project.slug}`,
        destination: project.detailHref,
        permanent: false,
      }));
  },
};

export default nextConfig;
