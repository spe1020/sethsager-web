import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/ExternalLink";
import { getProject, getProjects, projectStatusLabel } from "@/content/projects";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjects()
    .filter((project) => project.detailHref === `/work/${project.slug}`)
    .map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Work" };
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: project.detailHref },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.detailHref !== `/work/${project.slug}`) {
    notFound();
  }

  const others = getProjects().filter((item) => item.slug !== project.slug);
  const hasOutbound = Boolean(project.websiteUrl) || project.links.length > 0;

  return (
    <article className="shell detail-main">
      <Link className="back-link" href="/work">
        Work
      </Link>
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
                <ExternalLink href={project.websiteUrl} variant="pill">
                  Visit website
                </ExternalLink>
              </li>
            ) : null}
            {project.links.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href} variant="pill">
                  {link.label}
                </ExternalLink>
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
