import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialLink, ExternalLink } from "@/components/Actions";
import { JsonLd } from "@/components/JsonLd";
import { site, themes } from "@/content/site";
import { formatPostDate, getPost, getPublishedPosts, renderMarkdown } from "@/content/writing";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Writing" };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: post.canonical ?? `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [site.name],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
    },
    twitter: { card: "summary_large_image", images: ["/og-image.png"] },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="shell article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          author: { "@type": "Person", name: site.name, url: site.url },
          mainEntityOfPage: post.canonical ?? `${site.url}/writing/${post.slug}/`,
        }}
      />
      <EditorialLink href="/writing" direction="left">
        Writing
      </EditorialLink>
      <p className="eyebrow">
        {themes[post.theme].label} · <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>
      <h1>{post.title}</h1>
      <p className="lede">{post.summary}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
      {post.canonical ? (
        <p className="source-note article-source">
          Originally published on Substack.{" "}
          <ExternalLink href={post.canonical}>Read the original</ExternalLink>
        </p>
      ) : null}
    </article>
  );
}
