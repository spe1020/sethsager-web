import { fetchText } from "./http.mjs";
import { parseFeed } from "./rss.mjs";
import { htmlToText, normalizeUrl, toIso } from "./util.mjs";

/** Find a publication's RSS feed from its home page (<link rel="alternate" type="application/rss+xml">). */
export async function discoverFeedUrl(siteUrl, deps = {}) {
  const { text } = await fetchText(siteUrl, deps);
  const tag = [...text.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]).find((t) => /rel=["']alternate["']/i.test(t) && /application\/(rss|atom)\+xml/i.test(t));
  const href = tag && /href=["']([^"']+)["']/i.exec(tag)?.[1];
  return new URL(href ?? "/feed", siteUrl).toString();
}

/**
 * Fetch and validate the publication feed. Uses the configured feed URL and
 * falls back to discovery if it fails. Returns normalized, publishable items.
 *
 * Only what the public feed lists is ever returned, which already excludes
 * drafts. As extra guards an item must link into the publication, have a valid
 * date that is not in the future, and not match an exclude pattern.
 */
export async function fetchSubstack(cfg, deps = {}, now = new Date()) {
  const origin = new URL(cfg.siteUrl).origin;
  const tried = [];
  let feed;
  let feedUrl = cfg.feedUrl;
  for (const attempt of [() => cfg.feedUrl, () => discoverFeedUrl(cfg.siteUrl, deps)]) {
    try {
      feedUrl = await attempt();
      if (!feedUrl || tried.includes(feedUrl)) continue;
      tried.push(feedUrl);
      feed = parseFeed((await fetchText(feedUrl, deps)).text);
      if (feed.kind !== "rss" || feed.items.length === 0) throw new Error("feed has no items");
      break;
    } catch (err) {
      tried.push(`(${err.message})`);
      feed = undefined;
    }
  }
  if (!feed) throw new Error(`no usable feed: ${tried.join(" ")}`);

  const exclude = (cfg.excludeTitlePatterns ?? []).map((p) => new RegExp(p, "i"));
  const skipped = { invalid: 0, excluded: 0, future: 0 };
  const items = [];
  for (const raw of feed.items) {
    const url = raw.link && normalizeUrl(raw.link).startsWith(`${origin}/p/`) ? raw.link.split("?")[0] : null;
    const publishedAt = toIso(raw.published);
    if (!url || !raw.title.trim() || !publishedAt) {
      skipped.invalid++;
    } else if (Date.parse(publishedAt) > now.getTime()) {
      skipped.future++;
    } else if (exclude.some((re) => re.test(raw.title))) {
      skipped.excluded++;
    } else {
      items.push({ title: raw.title.trim(), url, publishedAt, description: htmlToText(raw.description) });
    }
  }
  return { feedUrl, title: feed.title, items, skipped };
}

/** Add new items to the stored list. Never removes anything. Deduplicates by URL. */
export function mergeSubstack(store, fetched) {
  const byUrl = new Map((store.items ?? []).map((i) => [normalizeUrl(i.url), i]));
  for (const item of fetched.items) byUrl.set(normalizeUrl(item.url), { ...byUrl.get(normalizeUrl(item.url)), ...item });
  const items = [...byUrl.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
  return { feedUrl: fetched.feedUrl, items };
}
