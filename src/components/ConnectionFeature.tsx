import Image from "next/image";
import Link from "next/link";
import { ProjectAction } from "@/components/ProjectAction";
import { getProject, type Project } from "@/content/projects";

export function ConnectionFeature({ project }: { project: Project }) {
  const presenter = project.presentedBySlug ? getProject(project.presentedBySlug) : undefined;

  return (
    <article className="connection-feature">
      {project.coverImage ? (
        <Image
          className="connection-artwork"
          sizes="260px"
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          width={project.coverImage.width}
          height={project.coverImage.height}
        />
      ) : null}
      <div className="connection-feature-body">
        <p className="kicker kicker-on-dark">
          <span className="index-num">{String(project.displayOrder).padStart(2, "0")}</span>
          {project.category}
        </p>
        <h3>{project.name}</h3>
        <p className="connection-desc">{project.description}</p>
        {presenter ? (
          <p className="connection-presented">
            Presented by{" "}
            <Link href={presenter.detailHref} className="inline-link">
              {presenter.name}
            </Link>
            . The show keeps its own page on this site.
          </p>
        ) : null}
        <ProjectAction project={project} tone="dark" />
      </div>
    </article>
  );
}
