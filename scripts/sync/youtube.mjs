import { fetchText } from "./http.mjs";
import { parseFeed } from "./rss.mjs";

const ID = /^[\w-]{11}$/;

/**
 * Candidate video ids from the channel. Only ids come from here; titles never
 * do (page scraping can pair the wrong id and title). Tries the channel's RSS
 * feed first, then falls back to the channel's /videos page.
 */
export async function discoverVideoIds(channelUrl, deps = {}) {
  const errors = [];
  try {
    const { text: page } = await fetchText(`${channelUrl.replace(/\/$/, "")}/videos`, {
      ...deps,
      headers: { "Accept-Language": "en-US,en;q=0.9", Cookie: "CONSENT=YES+1" },
    });
    const channelId = /"externalId":"(UC[\w-]{22})"/.exec(page)?.[1];
    if (channelId) {
      try {
        const { text } = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, deps);
        const ids = parseFeed(text).items.map((i) => i.videoId).filter((v) => ID.test(v));
        if (ids.length) return { ids: [...new Set(ids)], via: "channel RSS" };
        errors.push("channel RSS had no videos");
      } catch (err) {
        errors.push(`channel RSS unavailable (${err.message})`);
      }
    }
    const ids = [...page.matchAll(/"(?:videoId|contentId)":"([\w-]{11})"/g)].map((m) => m[1]);
    if (ids.length) return { ids: [...new Set(ids)], via: `channel page${errors.length ? ` (${errors.join("; ")})` : ""}` };
    errors.push("channel page listed no videos");
  } catch (err) {
    errors.push(`channel page unavailable (${err.message})`);
  }
  throw new Error(errors.join("; "));
}

/**
 * Ask YouTube's oEmbed endpoint what a video really is. It returns the exact
 * title and the owning channel, and 404s for ids that do not exist, so an id
 * is only trusted after it comes back owned by the expected channel.
 */
export async function verifyVideo(id, channelUrl, deps = {}) {
  if (!ID.test(id)) return null;
  try {
    const { text } = await fetchText(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`,
      { ...deps, retries: 1 },
    );
    const data = JSON.parse(text);
    if (!data.title || String(data.author_url).toLowerCase() !== channelUrl.toLowerCase()) return null;
    return { id, title: data.title };
  } catch {
    return null;
  }
}
