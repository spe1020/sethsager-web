import Link from "next/link";
import { Arrow, ExternalLink } from "@/components/Actions";
import { themes } from "@/content/site";
import { formatEntryDate, type WritingEntry } from "@/content/writing";

export function WritingList({ posts, limit }: { posts: WritingEntry[]; limit?: number }) {
  const shown = limit ? posts.slice(0, limit) : posts;
  return (
    <ul className="writing-list">
      {shown.map((post) => (
        <li key={post.key} className="writing-item">
          <p className="kicker">
            {post.theme ? themes[post.theme].label : "Substack"}
            {post.status === "draft" ? (
              <span className="draft-tag">Draft · not yet published</span>
            ) : (
              <>
                {" · "}
                <time dateTime={post.date}>{formatEntryDate(post.date)}</time>
              </>
            )}
          </p>
          <h3>
            {post.status !== "published" ? (
              post.title
            ) : post.external ? (
              <a href={post.href} target="_blank" rel="noopener noreferrer" className="writing-external">
                {post.title}
                <Arrow direction="external" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link href={post.href}>{post.title}</Link>
            )}
          </h3>
          <p>{post.summary}</p>
          {!post.external && post.originalUrl ? (
            <p className="source-note writing-original">
              <ExternalLink href={post.originalUrl}>Read the original on Substack</ExternalLink>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
