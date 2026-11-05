import Link from "next/link";
import { formatPostDate, type PostMeta } from "@/content/writing";
import { themes } from "@/content/site";

export function WritingList({ posts, limit }: { posts: PostMeta[]; limit?: number }) {
  const shown = limit ? posts.slice(0, limit) : posts;
  return (
    <ul className="writing-list">
      {shown.map((post) => (
        <li key={post.slug} className="writing-item">
          <p className="kicker">
            {themes[post.theme].label}
            {post.status === "draft" ? (
              <span className="draft-tag">Draft · not yet published</span>
            ) : (
              <>
                {" · "}
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              </>
            )}
          </p>
          <h3>
            {post.status === "published" ? (
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            ) : (
              post.title
            )}
          </h3>
          <p>{post.summary}</p>
        </li>
      ))}
    </ul>
  );
}
