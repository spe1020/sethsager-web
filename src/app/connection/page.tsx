import type { Metadata } from "next";
import Link from "next/link";
import { EpisodeList } from "@/components/EpisodeList";
import { ExternalLink } from "@/components/ExternalLink";
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
  const verifiedLabel = formatEpisodeDate(`${connectionShow.verifiedOn}T12:00:00Z`);

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
        The show has its own page here, separate from the product that presents it.
      </p>
      <p className="status" data-status={project.status}>
        {projectStatusLabel[project.status]}
      </p>

      {project.coverImage ? (
        <figure className="detail-cover connection-hero-art">
          <img
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            width={280}
            height={280}
          />
          {project.coverImage.caption ? (
            <figcaption className="cover-caption">{project.coverImage.caption}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <div className="listen-block">
        <h2>Listen and watch</h2>
        <ul className="outbound-links">
          {project.links.map((link) => (
            <li key={link.href}>
              <ExternalLink href={link.href} variant="pill">
                {link.label}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>

      <section className="episode-block" aria-labelledby="featured-episodes">
        <h2 id="featured-episodes">Featured episodes</h2>
        <p className="source-note">
          Titles, dates, durations, and the lines below are from the public podcast feed, checked
          on {verifiedLabel}. Video ids were confirmed on the YouTube channel.{" "}
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
          Connection sits beside the software on purpose. The tools try to make a complicated
          task simpler and leave the person using them in charge of the result. The show is that
          same interest, spoken: building, creativity, technology, community, relationships, and
          the rest of a human life. Zap Cooking presents it. The conversation keeps its own name.
        </p>
        <p>
          <Link href="/work">Back to the work index</Link>
        </p>
      </section>
    </article>
  );
}
