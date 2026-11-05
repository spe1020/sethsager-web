import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import substackData from "../../content/data/substack.json";
import type { ThemeKey } from "@/content/site";

/**
 * Lightweight Markdown publishing. Each file in /content/writing is one piece:
 *
 * ---
 * title: ...
 * date: YYYY-MM-DD
 * summary: ...
 * theme: building | thinking | connecting
 * status: draft | published
 * canonical: (optional) original URL if first published elsewhere, e.g. Substack
 * ---
 *
 * Drafts are listed (clearly labeled) but have no article page.
 * Pieces with a `canonical` URL are mirrored here; search engines are pointed at the original.
 */

export type PostStatus = "draft" | "published";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  theme: ThemeKey;
  status: PostStatus;
  /** Original location if first published elsewhere. Used as the canonical URL. */
  canonical?: string;
};

export type Post = PostMeta & { body: string };

const dir = path.join(process.cwd(), "content", "writing");
const themes: ThemeKey[] = ["building", "thinking", "connecting"];

function parse(slug: string, raw: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`content/writing/${slug}.md is missing frontmatter.`);

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    data[line.slice(0, i).trim()] = line
      .slice(i + 1)
      .trim()
      .replace(/^"(.*)"$/, "$1");
  }

  const { title, date, summary, theme, status, canonical } = data;
  if (canonical && !canonical.startsWith("https://")) {
    throw new Error(`${slug}: canonical must be https.`);
  }
  if (!title || !summary) throw new Error(`${slug}: title and summary are required.`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) throw new Error(`${slug}: date must be YYYY-MM-DD.`);
  if (!themes.includes(theme as ThemeKey)) throw new Error(`${slug}: unknown theme "${theme}".`);
  if (status !== "draft" && status !== "published") {
    throw new Error(`${slug}: status must be draft or published.`);
  }

  return { slug, title, date, summary, theme: theme as ThemeKey, status, canonical: canonical || undefined, body: match[2].trim() };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => parse(file.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, file), "utf8")))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((post) => post.status === "published");
}

export function getPost(slug: string): Post | undefined {
  return getPublishedPosts().find((post) => post.slug === slug);
}

export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false }) as string;
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}


// ---- Unified list: local Markdown + synced Substack feed -------------------

/**
 * One row in a writing list. Local Markdown posts keep their native pages.
 * Posts that exist only on Substack (added automatically by the content sync,
 * see README) link out to the original and are never republished here.
 */
export type WritingEntry = {
  key: string;
  title: string;
  /** ISO date or date-time, used for ordering and display. */
  date: string;
  summary: string;
  /** Only local posts carry a theme. */
  theme?: ThemeKey;
  status: PostStatus;
  /** Where the title goes: a page on this site, or the original off-site. */
  href: string;
  external: boolean;
  /** Original location, when the piece was first published elsewhere. */
  originalUrl?: string;
};

type SyncedItem = { title: string; url: string; publishedAt: string; description: string };

const slugOf = (url: string) => url.replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase();
const titleKey = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Local posts first, then feed items not already covered by a local post.
 * A feed item is a duplicate when its URL matches a local post's `canonical`
 * or its title matches a local post's title. Drafts only ever come from local
 * files; the Substack feed lists published posts only. Newest first.
 */
export function getWritingEntries(): WritingEntry[] {
  const synced = (substackData as { items: SyncedItem[] }).items;
  const feedByUrl = new Map(synced.map((item) => [slugOf(item.url), item]));
  const local = getAllPosts();

  const entries: WritingEntry[] = local.map((post) => {
    // Order a mirrored post by the feed's exact timestamp when we have it.
    const feed = post.canonical ? feedByUrl.get(slugOf(post.canonical)) : undefined;
    return {
      key: `local:${post.slug}`,
      title: post.title,
      date: feed?.publishedAt ?? post.date,
      summary: post.summary,
      theme: post.theme,
      status: post.status,
      href: `/writing/${post.slug}/`,
      external: false,
      originalUrl: post.canonical,
    };
  });

  const covered = new Set<string>();
  for (const post of local) {
    covered.add(titleKey(post.title));
    if (post.canonical) covered.add(slugOf(post.canonical));
  }
  for (const item of synced) {
    if (covered.has(slugOf(item.url)) || covered.has(titleKey(item.title))) continue;
    covered.add(slugOf(item.url));
    entries.push({
      key: `substack:${slugOf(item.url)}`,
      title: item.title,
      date: item.publishedAt,
      summary: item.description,
      status: "published",
      href: item.url,
      external: true,
      originalUrl: item.url,
    });
  }

  return entries.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export const formatEntryDate = (date: string) => formatPostDate(date.slice(0, 10));
