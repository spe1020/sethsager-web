import type { Metadata } from "next";
import { WritingList } from "@/components/WritingList";
import { site, themes } from "@/content/site";
import { getAllPosts } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: `Essays and notes by ${site.name} on building, systems, AI, leadership, and connection.`,
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getAllPosts();
  const published = posts.filter((post) => post.status === "published");
  const drafts = posts.filter((post) => post.status === "draft");

  return (
    <div className="shell page-intro">
      <p className="eyebrow">Writing</p>
      <h1>Thinking out loud.</h1>
      <p className="lede">
        Essays and notes on building products, open technology, systems thinking, AI and human
        agency, leadership, and communication.
      </p>
      <ul className="theme-list theme-list-inline">
        {Object.values(themes).map((theme) => (
          <li key={theme.label}>
            <strong>{theme.label}</strong>
            <span>{theme.blurb}</span>
          </li>
        ))}
      </ul>

      {published.length > 0 ? (
        <section aria-labelledby="published-title" className="writing-block">
          <h2 id="published-title">Published</h2>
          <WritingList posts={published} />
        </section>
      ) : (
        <p className="placeholder writing-block">
          Nothing is published yet. The pieces below are topics I am working on, not finished
          articles.
        </p>
      )}

      {drafts.length > 0 ? (
        <section aria-labelledby="drafts-title" className="writing-block">
          <h2 id="drafts-title">In progress</h2>
          <WritingList posts={drafts} />
        </section>
      ) : null}
    </div>
  );
}
