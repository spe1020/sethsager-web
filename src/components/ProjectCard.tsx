import Image from "next/image";
import { ProjectAction } from "@/components/ProjectAction";
import { projectStatusLabel, type Project } from "@/content/projects";

type ProjectCardProps = {
  project: Project;
  variant: "feature" | "secondary" | "index";
  reverse?: boolean;
  headingLevel?: 2 | 3;
};

export function ProjectCard({
  project,
  variant,
  reverse = false,
  headingLevel = 3,
}: ProjectCardProps) {
  const Title = headingLevel === 2 ? "h2" : "h3";
  const className = [
    "project-card",
    `project-card-${variant}`,
    reverse ? "is-reverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className}>
      <div className="project-card-media">
        {project.coverImage ? (
          <Image
            className={
              project.coverImage.kind === "artwork" ? "cover cover-artwork" : "cover"
            }
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            sizes={
              variant === "feature"
                ? "(max-width: 860px) 100vw, 640px"
                : variant === "secondary"
                  ? "(max-width: 860px) 100vw, 560px"
                  : "(max-width: 860px) 100vw, 240px"
            }
          />
        ) : (
          <div className="cover-fallback" role="img" aria-label={`${project.name} has no cover image yet`}>
            <span>{project.name}</span>
          </div>
        )}
        {project.logo ? (
          <Image
            className="project-logo"
            src={project.logo.src}
            alt=""
            width={project.logo.width}
            height={project.logo.height}
          />
        ) : null}
      </div>
      <div className="project-card-body">
        <p className="kicker">
          <span className="index-num">{String(project.displayOrder).padStart(2, "0")}</span>
          {project.category}
        </p>
        <Title>{project.name}</Title>
        <p className="project-card-desc">{project.description}</p>
        {project.role ? <p className="project-role">{project.role}</p> : null}
        <p className="status" data-status={project.status}>
          {projectStatusLabel[project.status]}
        </p>
        <ProjectAction project={project} />
      </div>
    </article>
  );
}
