import type { Metadata } from "next";
import Link from "next/link";
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
            <Link className="button button-primary" href="#selected-work">
              Explore my work
            </Link>
            <Link className="button button-secondary" href="/writing">
              Read my writing
            </Link>
          </div>
        </div>
        <Portrait priority />
      </section>

      <div className="shell">
        <SelectedWork />
      </div>

      <section className="philosophy" aria-labelledby="philosophy-title">
        <div className="shell philosophy-inner">
          <div>
            <p className="eyebrow eyebrow-on-dark">Philosophy</p>
            <h2 id="philosophy-title">Complexity is easy to create. Simplicity takes work.</h2>
          </div>
          <div className="philosophy-body">
            <p>
              Manufacturing and operations taught me to look at how work actually moves: where it
              stalls, who inherits the mess, and why the same problem keeps coming back. The fix is
              rarely a bigger system. It is usually a clearer one.
            </p>
            <p>
              Continuous improvement is a habit of noticing, trying something small, checking
              whether it worked, and keeping what was learned. I bring that same loop to
              entrepreneurship and software: build the simple version, put it in front of real use,
              and let reality edit the plan.
            </p>
            <p>
              The tools I make share one aim. Take something complicated, make it easier to
              understand, and leave the person using it with more say than they started with.
            </p>
          </div>
        </div>
      </section>

      <section className="shell home-section" aria-labelledby="writing-title">
        <SectionHead id="writing-title" eyebrow="Writing" title="Thinking out loud.">
          Notes on building products, open technology, systems, AI and human agency, leadership,
          and how people connect.
        </SectionHead>
        <WritingList posts={posts} limit={4} />
        <p className="section-more">
          <Link href="/writing">All writing</Link>
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
            <Link className="text-link" href="/about">
              More about me
            </Link>
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
            <Link className="button button-primary" href="/connect">
              Get in touch
            </Link>
            <ul className="inline-socials">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
