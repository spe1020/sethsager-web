import type { Metadata } from "next";
import Link from "next/link";
import { Portrait } from "@/components/Portrait";
import { site, themes } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is a builder, entrepreneur, and systems thinker. ${site.thesis}`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="shell page-intro">
      <p className="eyebrow">About</p>
      <div className="about-grid">
        <div>
          <h1>I like making things simpler.</h1>
          <p className="lede">
            I’m Seth Sager: an entrepreneur, builder, and systems thinker. {site.thesis}
          </p>
          <div className="prose">
            <p>
              My background is in manufacturing, operations, and continuous improvement. That
              work trains you to ask a plain question over and over: what is actually happening
              here, and what is the smallest change that would help? I still start there, whether
              the thing in front of me is a production line or a piece of software.
            </p>
            <p>
              I build because it is the fastest way to find out if an idea is any good. Ideas are
              easy and everyone has them. Making one real, getting it in front of people, and
              learning from what happens is the interesting part.
            </p>
            <h2>What I care about</h2>
            <ul className="theme-list">
              {Object.values(themes).map((theme) => (
                <li key={theme.label}>
                  <strong>{theme.label}</strong>
                  <span>{theme.blurb}</span>
                </li>
              ))}
            </ul>
            <h2>How I try to work</h2>
            <p>
              Keep it simple. Prefer open technology and tools that leave people in control of
              their own information. Use AI where it helps, and keep a person at the point of
              decision. Stay curious, stay grateful, and talk to interesting people.
            </p>
            <p>
              The projects are on the <Link href="/work">work page</Link>, the podcast is{" "}
              <Link href="/connection">Connection</Link>, and what has my attention right now is
              on <Link href="/now">the now page</Link>. If you want to talk, start{" "}
              <Link href="/connect">here</Link>.
            </p>
          </div>
        </div>
        <Portrait />
      </div>
    </div>
  );
}
