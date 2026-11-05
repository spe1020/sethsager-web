import type { Metadata } from "next";
import Link from "next/link";
import { now } from "@/content/now";
import { site } from "@/content/site";
import { formatEpisodeDate } from "@/content/connection";

export const metadata: Metadata = {
  title: "Now",
  description: `What ${site.name} is building and exploring right now.`,
  alternates: { canonical: "/now" },
};

export default function NowPage() {
  return (
    <div className="shell page-intro">
      <p className="eyebrow">Now</p>
      <h1>What I’m building and exploring.</h1>
      <p className="lede">{now.intro}</p>
      <p className="source-note">Updated {formatEpisodeDate(`${now.updated}T12:00:00Z`)}.</p>
      {now.sections.map((section) => (
        <section key={section.heading} className="now-block">
          <h2>{section.heading}</h2>
          <ul className="now-list">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
      <p>
        <Link className="text-link" href="/work">
          See the projects
        </Link>
      </p>
    </div>
  );
}
