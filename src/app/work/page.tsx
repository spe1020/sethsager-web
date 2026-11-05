import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Work",
  description: `Projects by ${site.name}. ${site.thesis}`,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const projects = getProjects();

  return (
    <div className="shell page-intro">
      <p className="eyebrow">Index</p>
      <h1>Work</h1>
      <p className="lede">
        {site.thesis} The list below is the whole portfolio, in the order I want it read:
        the larger product work first, then the daily practice, then the show.
      </p>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant="index"
            headingLevel={2}
          />
        ))}
      </div>
    </div>
  );
}
