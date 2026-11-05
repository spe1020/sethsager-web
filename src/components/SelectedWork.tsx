import Link from "next/link";
import { ConnectionFeature } from "@/components/ConnectionFeature";
import { ProjectCard } from "@/components/ProjectCard";
import { projectsByProminence } from "@/content/projects";

export function SelectedWork() {
  const features = projectsByProminence("feature");
  const secondary = projectsByProminence("secondary");
  const editorial = projectsByProminence("editorial");

  return (
    <section id="selected-work" className="selected-work" aria-labelledby="selected-work-title">
      <div className="section-head">
        <h2 id="selected-work-title">Selected work</h2>
        <p>Five projects. One practice.</p>
      </div>
      <div className="stack">
        {features.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant="feature"
            reverse={index % 2 === 1}
          />
        ))}
      </div>
      <div className="pair">
        {secondary.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="secondary" />
        ))}
      </div>
      <div className="stack editorial-slot">
        {editorial.map((project) => (
          <ConnectionFeature key={project.slug} project={project} />
        ))}
      </div>
      <p className="section-more">
        <Link href="/work">Work index</Link>
      </p>
    </section>
  );
}
