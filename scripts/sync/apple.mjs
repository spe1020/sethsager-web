import { fetchText } from "./http.mjs";

/**
 * Apple's public iTunes Lookup API lists a show's episodes WITH each episode's
 * RSS guid, so Apple links are matched by guid, never guessed from titles.
 * @returns {Promise<Map<string, string>>} guid -> episode URL on podcasts.apple.com
 */
export async function fetchAppleEpisodeUrls(showUrl, deps = {}) {
  const id = /\/id(\d+)/.exec(showUrl)?.[1];
  if (!id) throw new Error(`cannot find an Apple show id in ${showUrl}`);
  const { text } = await fetchText(`https://itunes.apple.com/lookup?id=${id}&entity=podcastEpisode&limit=200`, deps);
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Apple lookup did not return JSON");
  }
  if (!Array.isArray(data.results)) throw new Error("Apple lookup response has no results");
  const out = new Map();
  for (const r of data.results) {
    if (r.wrapperType !== "podcastEpisode" || !r.episodeGuid || !r.trackViewUrl) continue;
    let url;
    try {
      url = new URL(r.trackViewUrl);
    } catch {
      continue;
    }
    // Must be this show on Apple Podcasts, pointing at a specific episode.
    if (url.hostname !== "podcasts.apple.com" || !url.pathname.endsWith(`/id${id}`) || !url.searchParams.get("i")) continue;
    out.set(r.episodeGuid, `https://podcasts.apple.com${url.pathname}?i=${url.searchParams.get("i")}`);
  }
  return out;
}
