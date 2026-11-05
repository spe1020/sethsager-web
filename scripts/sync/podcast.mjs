import { fetchText } from "./http.mjs";
import { parseFeed } from "./rss.mjs";
import { htmlToParagraphs, toIso } from "./util.mjs";

const DURATION = /^\d{1,2}:\d{2}(:\d{2})?$/;

/** Fetch and validate the podcast RSS feed into episodes (guid, title, notes, date, duration). */
export async function fetchPodcast(cfg, deps = {}, now = new Date()) {
  const feed = parseFeed((await fetchText(cfg.feedUrl, deps)).text);
  if (feed.kind !== "rss" || feed.items.length === 0) throw new Error("feed has no episodes");
  const episodes = [];
  let skipped = 0;
  for (const raw of feed.items) {
    const publishedAt = toIso(raw.published);
    const paragraphs = htmlToParagraphs(raw.description);
    if (!raw.guid || !raw.title.trim() || !publishedAt || Date.parse(publishedAt) > now.getTime()) {
      skipped++;
      continue;
    }
    episodes.push({
      guid: raw.guid,
      title: raw.title.trim(),
      summary: paragraphs[0] ?? "",
      notes: paragraphs.slice(1),
      publishedAt,
      duration: DURATION.test(raw.duration) ? raw.duration : "",
    });
  }
  return { title: feed.title, episodes, skipped };
}

/**
 * Add new/updated episodes to the stored list; never remove one. The feed wins
 * for feed fields (titles can be corrected upstream). Apple and YouTube links
 * already found are kept unless a fresh, verified value replaces them.
 */
export function mergePodcast(store, fetched, apple = new Map(), videos = new Map()) {
  const byGuid = new Map((store.episodes ?? []).map((e) => [e.guid, e]));
  for (const ep of fetched.episodes) byGuid.set(ep.guid, { ...byGuid.get(ep.guid), ...ep });
  const episodes = [...byGuid.values()].map((ep) => {
    const next = { ...ep };
    const appleUrl = apple.get(ep.guid);
    if (appleUrl) next.appleUrl = appleUrl;
    const video = videos.get(ep.guid);
    if (video) {
      next.youtubeId = video.id;
      next.youtubeTitle = video.title;
      next.youtubeMatch = video.method;
    }
    return next;
  });
  episodes.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
  return { feedUrl: store.feedUrl, episodes };
}
