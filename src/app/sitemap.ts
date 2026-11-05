import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { getPublishedPosts } from "@/content/writing";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/work",
    "/writing",
    "/about",
    "/connection",
    "/connect",
    "/speaking",
    "/now",
    ...projects.map((project) => project.detailHref),
    ...getPublishedPosts()
      .filter((post) => !post.canonical)
      .map((post) => `/writing/${post.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${site.url}${path === "/" ? "/" : `${path}/`}` }));
}
