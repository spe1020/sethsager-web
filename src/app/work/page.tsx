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
      <p className="eyebrow">What I’m building</p>
      <h1>Things I’m working on.</h1>
      <p className="lede">A few projects, ideas, and communities I’ve helped bring to life.</p>
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
