import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditorialLink, PrimaryAction, SecondaryAction } from "@/components/Actions";
import { getProject, getProjects, projectStatusLabel } from "@/content/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  // Every project gets a page. Ones whose detail page lives elsewhere (for
  // example Connection at /connection) render a static redirect to it.
  return getProjects().map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  const moved = project.detailHref !== `/work/${project.slug}`;
  return {
    ...(moved ? { robots: { index: false } } : {}),
    title: project.name,
    description: project.description,
    alternates: { canonical: project.detailHref },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  if (project.detailHref !== `/work/${project.slug}`) {
    // Static hosting has no server redirects, so this is a plain HTML page that
    // forwards with a meta refresh and still works without JavaScript.
    return (
      <div className="shell page-intro">
        <meta httpEquiv="refresh" content={`0; url=${project.detailHref}/`} />
        <h1>{project.name}</h1>
        <p className="lede">
          This page has moved.{" "}
          <EditorialLink href={project.detailHref}>Continue to {project.name}</EditorialLink>
        </p>
      </div>
    );
  }

  const others = getProjects().filter((item) => item.slug !== project.slug);
  const hasOutbound = Boolean(project.websiteUrl) || project.links.length > 0;

  return (
    <article className="shell detail-main">
      <EditorialLink href="/work" direction="left">
        Work
      </EditorialLink>
      <div className="detail-kicker">
        {project.logo ? (
          <Image
            className="detail-logo"
            src={project.logo.src}
            alt={project.logo.alt}
            width={project.logo.width}
            height={project.logo.height}
          />
        ) : null}
        <p className="kicker">
          <span className="index-num">{String(project.displayOrder).padStart(2, "0")}</span>
          {project.category}
        </p>
        <p className="status" data-status={project.status}>
          {projectStatusLabel[project.status]}
        </p>
      </div>
      <h1>{project.name}</h1>
      <p className="lede">{project.description}</p>
      {project.role ? <p className="project-role">{project.role}</p> : null}

      {project.coverImage ? (
        <figure className="detail-cover">
          <Image
            src={project.coverImage.src}
            sizes="(max-width: 1120px) 100vw, 1120px"
            priority
            alt={project.coverImage.alt}
            width={project.coverImage.width}
            height={project.coverImage.height}
          />
          {project.coverImage.caption ? (
            <figcaption className="cover-caption">{project.coverImage.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      {hasOutbound ? (
        <div className="detail-actions">
          <h2>Off this site</h2>
          <p className="source-note">These links open the project itself. This page stays here.</p>
          <ul className="outbound-links">
            {project.websiteUrl ? (
              <li>
                <PrimaryAction external href={project.websiteUrl}>
                  Visit {project.name}
                </PrimaryAction>
              </li>
            ) : null}
            {project.links.map((link) => (
              <li key={link.href}>
                <SecondaryAction external href={link.href}>
                  {link.label}
                </SecondaryAction>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {project.caseStudy ? (
        <div className="case-study">
          {project.caseStudy.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      ) : null}

      <aside className="also">
        <h2>Also in the work</h2>
        <ul className="also-list">
          {others.map((item) => (
            <li key={item.slug}>
              <Link href={item.detailHref}>
                {item.name}
                <span>{item.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
