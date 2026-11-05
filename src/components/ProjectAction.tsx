import { EditorialLink, ExternalLink, type Tone } from "@/components/Actions";
import type { Project } from "@/content/projects";

/**
 * Link treatment for a project card.
 *
 * - One internal link ("The story behind it", right arrow). It stretches over
 *   the whole card, so the card is clickable without a second, redundant link.
 * - External destinations ("Visit Zap Cooking", diagonal arrow) sit above that
 *   overlay, so they never get swallowed by the card click.
 */
export function ProjectAction({ project, tone = "light" }: { project: Project; tone?: Tone }) {
  const external = [
    ...(project.websiteUrl ? [{ label: `Visit ${project.name}`, href: project.websiteUrl }] : []),
    ...project.links,
  ];

  return (
    <div className={`project-actions tone-${tone}`}>
      <EditorialLink
        href={project.detailHref}
        stretch
        tone={tone}
        className="project-action-internal"
      >
        {project.detailLabel ?? "The story behind it"}
        <span className="sr-only">: {project.name}</span>
      </EditorialLink>
      {external.length > 0 ? (
        <ul className="project-actions-external">
          {external.map((link) => (
            <li key={link.href}>
              <ExternalLink href={link.href} tone={tone}>
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
