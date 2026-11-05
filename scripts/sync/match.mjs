// Pure, conservative rules for deciding that a YouTube video IS a given episode.
// A wrong video on the site is worse than no video, so anything ambiguous is rejected.

const squash = (s) =>
  String(s)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Episode number from "Connection Ep. 8" / "Episode 8", or null. */
export function episodeNumber(title) {
  const m = /\b(?:ep|episode)\.?\s*(\d+)\b/i.exec(String(title));
  return m ? Number(m[1]) : null;
}

/** The title without the trailing "| Connection ..." tag. */
export const coreTitle = (title) => squash(String(title).split("|")[0]);

/**
 * How (if at all) a video title verifies against an episode title.
 *  - "exact-title": identical after normalizing case, punctuation, quotes, "&"
 *  - "core-title+episode-number": the part before "|" is identical AND both
 *    carry the same explicit episode number
 * Returns null when the match is not verified.
 */
export function verifyTitles(episodeTitle, videoTitle) {
  if (squash(episodeTitle) === squash(videoTitle) && squash(episodeTitle) !== "") return "exact-title";
  const a = episodeNumber(episodeTitle);
  const b = episodeNumber(videoTitle);
  if (a !== null && a === b && coreTitle(episodeTitle) !== "" && coreTitle(episodeTitle) === coreTitle(videoTitle)) {
    return "core-title+episode-number";
  }
  return null;
}

/**
 * Match videos to episodes. `videos` are already verified to belong to the
 * channel. Ambiguity (one video fitting two episodes, or one episode fitting
 * two videos) rejects every involved pair.
 * @returns {Map<string, {id: string, title: string, method: string}>} keyed by episode guid
 */
export function matchVideos(episodes, videos) {
  const pairs = [];
  for (const ep of episodes) {
    for (const v of videos) {
      const method = verifyTitles(ep.title, v.title);
      if (method) pairs.push({ guid: ep.guid, id: v.id, title: v.title, method });
    }
  }
  const byEpisode = new Map();
  const byVideo = new Map();
  for (const p of pairs) {
    byEpisode.set(p.guid, (byEpisode.get(p.guid) ?? 0) + 1);
    byVideo.set(p.id, (byVideo.get(p.id) ?? 0) + 1);
  }
  const out = new Map();
  for (const p of pairs) {
    if (byEpisode.get(p.guid) === 1 && byVideo.get(p.id) === 1) out.set(p.guid, { id: p.id, title: p.title, method: p.method });
  }
  return out;
}
