import type { Metadata } from "next";
import Image from "next/image";
import { Photo } from "@/components/Photo";
import Link from "next/link";
import { EpisodeList } from "@/components/EpisodeList";
import { EditorialLink, ExternalLink, SecondaryAction } from "@/components/Actions";
import {
  connectionShow,
  formatEpisodeDate,
  getEarlierEpisodes,
  getFeaturedEpisodes,
} from "@/content/connection";
import { getProject, projectStatusLabel, type Project } from "@/content/projects";

function requireConnection(): Project {
  const found = getProject("connection");
  if (!found) {
    throw new Error("Connection is missing from the project list.");
  }
  return found;
}

const project = requireConnection();
const presenter = project.presentedBySlug ? getProject(project.presentedBySlug) : undefined;

export const metadata: Metadata = {
  title: project.name,
  description: project.description,
  alternates: { canonical: project.detailHref },
};

export default function ConnectionPage() {
  const featured = getFeaturedEpisodes();
  const earlier = getEarlierEpisodes();
  const updatedLabel = connectionShow.updatedAt ? formatEpisodeDate(connectionShow.updatedAt) : null;

  return (
    <article className="shell connection-page">
      <p className="eyebrow">Podcast</p>
      <h1>{project.name}</h1>
      <p className="lede">{project.description}</p>
      <p>
        {presenter ? (
          <>
            Presented by <Link href={presenter.detailHref}>{presenter.name}</Link>.{" "}
          </>
        ) : null}
      </p>
      <p className="status" data-status={project.status}>
        {projectStatusLabel[project.status]}
      </p>

      <div className="connection-hero">
        {project.coverImage ? (
          <figure className="detail-cover connection-hero-art">
            <Image
              src={project.coverImage.src}
              priority
              alt={project.coverImage.alt}
              width={280}
              height={280}
            />
            {project.coverImage.caption ? (
              <figcaption className="cover-caption">{project.coverImage.caption}</figcaption>
            ) : null}
          </figure>
        ) : null}
        <figure className="detail-cover connection-hero-photo">
          <Photo id="connection-studio" priority sizes="(max-width: 860px) 100vw, 640px" />
          <figcaption className="cover-caption">Seth at the microphone.</figcaption>
        </figure>
      </div>

      <div className="listen-block">
        <h2>Listen and watch</h2>
        <ul className="outbound-links">
          {project.links.map((link) => (
            <li key={link.href}>
              <SecondaryAction external href={link.href}>
                {link.label}
              </SecondaryAction>
            </li>
          ))}
        </ul>
      </div>

      <section className="episode-block" aria-labelledby="featured-episodes">
        <h2 id="featured-episodes">Featured episodes</h2>
        <p className="source-note">
          Episodes update automatically from the public podcast feed{updatedLabel ? `, last updated ${updatedLabel}` : ""}.
          A YouTube video is shown only when it has been verified as that episode.{" "}
          <ExternalLink href={connectionShow.feedUrl}>Podcast RSS</ExternalLink>
        </p>
        <EpisodeList
          episodes={featured}
          showVideo
          emptyLabel="Featured episodes will appear here once a verified feed is connected. Nothing is listed yet."
        />
      </section>

      <section className="episode-block" aria-labelledby="earlier-episodes">
        <h2 id="earlier-episodes">Earlier episodes</h2>
        <EpisodeList
          episodes={earlier}
          showVideo={false}
          emptyLabel="Earlier episodes will appear here once a verified feed is connected. Nothing is listed yet."
        />
      </section>

      <section className="why-block" aria-labelledby="why-title">
        <h2 id="why-title">Why the show exists</h2>
        <blockquote className="statement">
          {connectionShow.statement.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </blockquote>
        <p className="source-note">From the show’s public description.</p>
        <p>
          <EditorialLink href="/work" direction="left">
            Back to the work index
          </EditorialLink>
        </p>
      </section>
    </article>
  );
}
