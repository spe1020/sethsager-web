import type { Metadata } from "next";
import { ExternalLink, PrimaryAction } from "@/components/Actions";
import { site, socialLinks } from "@/content/site";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Connect",
  description: `Get in touch with ${site.name}, and find the projects and podcast online.`,
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  const sites = projects.filter((project) => project.websiteUrl);

  return (
    <div className="shell page-intro">
      <p className="eyebrow">Connect</p>
      <h1>Good things start with a conversation.</h1>
      <p className="lede">
        If something here sparks an idea, or you are building something and want to compare notes,
        I would like to hear about it.
      </p>

      <section className="connect-block" aria-labelledby="reach-title">
        <h2 id="reach-title">Reach me</h2>
        {site.email ? (
          <p>
            <PrimaryAction href={`mailto:${site.email}`}>{site.email}</PrimaryAction>
          </p>
        ) : (
          <p className="placeholder">
            A direct email address is not published here yet. For now, the best way to reach me is
            through the profiles below.
          </p>
        )}
      </section>

      <section className="connect-block" aria-labelledby="elsewhere-title">
        <h2 id="elsewhere-title">Elsewhere</h2>
        <ul className="link-rows">
          {socialLinks.map((link) => (
            <li key={link.href}>
              <ExternalLink href={link.href}>{link.label}</ExternalLink>
              <span>{link.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="connect-block" aria-labelledby="projects-title">
        <h2 id="projects-title">The projects</h2>
        <ul className="link-rows">
          {sites.map((project) => (
            <li key={project.slug}>
              <ExternalLink href={project.websiteUrl!}>{project.name}</ExternalLink>
              <span>{project.category}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
