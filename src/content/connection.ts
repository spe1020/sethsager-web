import curatedData from "../../content/data/podcast-curated.json";
import sources from "../../content/sources.json";
import syncedData from "../../content/data/podcast.json";

/**
 * Connection episodes.
 *
 * Titles, notes, dates, and durations come from the public podcast RSS feed.
 * A scheduled GitHub Action (scripts/sync, see README) stores them in
 * content/data/podcast.json. The site is built from that committed file, never
 * from a live request, so builds are reproducible and a feed outage cannot
 * change or break the site.
 *
 * content/data/podcast-curated.json holds links that were verified by hand
 * (YouTube videos, and Apple episode URLs). They always win over synced
 * values. A YouTube video is only ever attached to an episode when it was
 * curated here or verified by the sync's matching rules; never guessed.
 */

export type ConnectionEpisode = {
  guid: string;
  title: string;
  summary: string;
  /** Remaining show-note paragraphs (plain text), after the summary. */
  notes: string[];
  /** ISO-8601 timestamp from the feed. */
  publishedAt: string;
  /** Duration as published, HH:MM:SS. */
  duration: string;
  /** Episode-specific Apple link. Falls back to the show page when unknown. */
  appleUrl?: string;
  youtubeId?: string;
  youtubeTitle?: string;
  /** The newest episodes are featured. Derived, not stored. */
  featured: boolean;
};

type StoredEpisode = {
  guid: string;
  title: string;
  summary: string;
  notes?: string[];
  publishedAt: string;
  duration: string;
  appleUrl?: string;
  youtubeId?: string;
  youtubeTitle?: string;
};

type CuratedLinks = Pick<StoredEpisode, "guid" | "appleUrl" | "youtubeId" | "youtubeTitle">;

/** How many of the newest episodes the Connection page features. */
export const FEATURED_COUNT = 3;

export const connectionShow = {
  feedUrl: sources.connection.feedUrl,
  appleShowUrl: sources.connection.appleShowUrl,
  youtubeChannelUrl: sources.connection.youtubeChannelUrl,
  /** When the stored feed data last changed (not when it was last checked). */
  updatedAt: (syncedData as { updatedAt?: string }).updatedAt,
  statement: [
    "Connection is a podcast about food, people, ideas, building, gratitude, and the things that bring us together.",
    "Through conversations with builders, creators, cooks, technologists, thinkers, and interesting people, we explore what we can learn from each other, what’s already good, and what we can make better.",
    "Problems are real, but we’re not doomed. Stay curious. Build useful things. Be grateful. Connect.",
    "Presented by Zap Cooking.",
  ],
} as const;

function buildEpisodes(synced: StoredEpisode[], curated: CuratedLinks[]): ConnectionEpisode[] {
  const links = new Map(curated.map((c) => [c.guid, c]));
  const merged = synced.map((episode) => {
    const pinned = links.get(episode.guid);
    return {
      guid: episode.guid,
      title: episode.title,
      summary: episode.summary,
      notes: episode.notes ?? [],
      publishedAt: episode.publishedAt,
      duration: episode.duration,
      // Hand-verified links win over synced ones.
      appleUrl: pinned?.appleUrl ?? episode.appleUrl,
      youtubeId: pinned?.youtubeId ?? episode.youtubeId,
      youtubeTitle: pinned?.youtubeTitle ?? episode.youtubeTitle,
    };
  });
  return merged
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title))
    .map((episode, index) => ({ ...episode, featured: index < FEATURED_COUNT }));
}

export const connectionEpisodes: ConnectionEpisode[] = buildEpisodes(
  (syncedData as { episodes: StoredEpisode[] }).episodes,
  curatedData as CuratedLinks[],
);

function assertEpisodes(list: ConnectionEpisode[]) {
  const guids = new Set<string>();
  for (const episode of list) {
    if (guids.has(episode.guid)) {
      throw new Error(`Duplicate episode guid: ${episode.guid}`);
    }
    guids.add(episode.guid);
    if (episode.appleUrl && !episode.appleUrl.startsWith("https://")) {
      throw new Error(`Episode ${episode.guid} needs an https Apple link.`);
    }
    if (Number.isNaN(Date.parse(episode.publishedAt))) {
      throw new Error(`Episode ${episode.guid} has an invalid date.`);
    }
    if (episode.youtubeId && !/^[\w-]{11}$/.test(episode.youtubeId)) {
      throw new Error(`Episode ${episode.guid} has a malformed YouTube id.`);
    }
    if (episode.youtubeId && !episode.youtubeTitle) {
      throw new Error(`Episode ${episode.guid} has a video id without a YouTube title.`);
    }
  }
}

assertEpisodes(connectionEpisodes);

export function getLatestEpisode(): ConnectionEpisode | undefined {
  return connectionEpisodes[0];
}

export function getFeaturedEpisodes(): ConnectionEpisode[] {
  return connectionEpisodes.filter((episode) => episode.featured);
}

export function getEarlierEpisodes(): ConnectionEpisode[] {
  return connectionEpisodes.filter((episode) => !episode.featured);
}

export function formatDuration(raw: string): string {
  const parts = raw.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return raw;
  const seconds =
    parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  }
  return `${minutes} min`;
}

export function formatEpisodeDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function titlesDiffer(left: string, right: string): boolean {
  const normalize = (value: string) =>
    value.replaceAll("’", "'").replaceAll("—", "-").replaceAll("–", "-").trim();
  return normalize(left) !== normalize(right);
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
