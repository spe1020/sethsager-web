import type { Metadata } from "next";
import { EditorialLink, ExternalLink, PrimaryAction, SecondaryAction } from "@/components/Actions";
import { Band } from "@/components/Band";
import { Portrait } from "@/components/Portrait";
import { SectionHead } from "@/components/SectionHead";
import { SelectedWork } from "@/components/SelectedWork";
import { WritingList } from "@/components/WritingList";
import { site, socialLinks, themes } from "@/content/site";
import { getAllPosts } from "@/content/writing";

export const metadata: Metadata = {
  title: { absolute: `${site.name} · ${site.tagline}` },
  description: site.thesis,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="shell hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{site.eyebrow}</p>
          <h1 id="hero-title">
            There’s always <em>a better way.</em>
          </h1>
          <p className="lede">
            I’m Seth. I build products, rethink systems, and explore ideas that make technology
            more useful and life a little more human.
          </p>
          <div className="cta-row">
            <PrimaryAction href="#selected-work">Explore my work</PrimaryAction>
            <SecondaryAction href="/writing">Read my writing</SecondaryAction>
          </div>
        </div>
        <Portrait priority />
      </section>

      <div className="shell">
        <SelectedWork />
      </div>

      <Band
        id="experience-title"
        eyebrow="Beyond the code"
        title={
          <>
            Built on <em>experience.</em>
          </>
        }
        caption="Manufacturing · Supply chain · Operations"
        action={
          <EditorialLink href="/about" tone="dark">
            More about my background
          </EditorialLink>
        }
      >
        <p>
          I’ve spent over 20 years in manufacturing, supply chain, and operations, working to
          understand how things work, where they break down, and how to make them better.
        </p>
        <p>
          That experience shapes how I approach everything I build today. Whether it’s a production
          process, a business, or a piece of software, the fundamentals are often the same:
          understand the problem, challenge assumptions, and keep improving.
        </p>
      </Band>

      <section className="shell home-section" aria-labelledby="writing-title">
        <SectionHead id="writing-title" eyebrow="Writing" title="Thinking out loud.">
          Notes on building products, open technology, systems, AI and human agency, leadership,
          and how people connect.
        </SectionHead>
        <WritingList posts={posts} limit={4} />
        <p className="section-more">
          <EditorialLink href="/writing">All writing</EditorialLink>
        </p>
      </section>

      <section className="shell home-section about-teaser" aria-labelledby="about-title">
        <SectionHead id="about-title" eyebrow="About" title="Curious first, then useful." />
        <div className="about-teaser-body">
          <p>
            I like understanding how a thing works well enough to make it simpler. That curiosity has
            carried me across manufacturing, operations, and software, and into building my own
            projects.
          </p>
          <p>
            What I make falls under three headings, and most of my days move between them.
          </p>
          <ul className="theme-list">
            {Object.values(themes).map((theme) => (
              <li key={theme.label}>
                <strong>{theme.label}</strong>
                <span>{theme.blurb}</span>
              </li>
            ))}
          </ul>
          <p>
            <EditorialLink href="/about">More about me</EditorialLink>
          </p>
        </div>
      </section>

      <section className="connect-band" aria-labelledby="connect-title">
        <div className="shell connect-band-inner">
          <div>
            <p className="eyebrow">Connect</p>
            <h2 id="connect-title">Good things start with a conversation.</h2>
            <p>
              If something here sparks an idea, or you are building something and want to compare
              notes, say hello.
            </p>
          </div>
          <div className="cta-row">
            <PrimaryAction href="/connect">Get in touch</PrimaryAction>
            <ul className="outbound-links">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <ExternalLink href={link.href}>{link.label}</ExternalLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
