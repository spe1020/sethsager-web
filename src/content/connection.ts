/**
 * Connection episodes verified on November 4, 2026 (America/New_York)
 * from the public podcast RSS feed and the Zap Cooking YouTube channel.
 * Titles, dates, durations, summaries, Apple links, and video ids are from
 * those sources. Nothing here is a placeholder episode.
 *
 * RSS: https://anchor.fm/s/1172d9cb4/podcast/rss
 * YouTube titles were confirmed with YouTube oEmbed.
 * Episode 3 uses a different title on YouTube than in the podcast feed.
 * There is no episode 5 in the feed.
 */

export type ConnectionEpisode = {
  guid: string;
  title: string;
  summary: string;
  /** ISO-8601 timestamp from the feed. */
  publishedAt: string;
  /** Duration as published, HH:MM:SS. */
  duration: string;
  appleUrl: string;
  youtubeId?: string;
  youtubeTitle?: string;
  featured: boolean;
};

export const connectionShow = {
  feedUrl: "https://anchor.fm/s/1172d9cb4/podcast/rss",
  verifiedOn: "2026-11-04",
  statement: [
    "Connection is a podcast about food, people, ideas, building, gratitude, and the things that bring us together.",
    "Through conversations with builders, creators, cooks, technologists, thinkers, and interesting people, we explore what we can learn from each other, what’s already good, and what we can make better.",
    "Problems are real, but we’re not doomed. Stay curious. Build useful things. Be grateful. Connect.",
    "Presented by Zap Cooking.",
  ],
} as const;

export const connectionEpisodes: ConnectionEpisode[] = [
  {
    guid: "70011a23-d3b8-460f-8f67-fb87929e453a",
    title: "We Know Everything About Each Other. Except Each Other. | Connection Ep. 8",
    summary:
      "We know where our friends went on vacation, what their kids are doing, and what they posted yesterday. But when was the last time we actually talked to them?",
    publishedAt: "2026-10-31T23:08:58Z",
    duration: "00:35:07",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/we-know-everything-about-each-other-except-each-other/id6811601309?i=1000799132281",
    youtubeId: "RWGIQcMdRL0",
    youtubeTitle:
      "We Know Everything About Each Other. Except Each Other. | Connection Ep. 8",
    featured: true,
  },
  {
    guid: "b8752c38-b454-4334-8c57-94fc61d2d3a8",
    title: "We Gave Away the Internet. Now We Can Take It Back. | Connection Ep. 7 with Derek Ross",
    summary: "What if we built the internet, only to give it away?",
    publishedAt: "2026-10-24T23:00:00Z",
    duration: "00:59:17",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/we-gave-away-the-internet-now-we-can-take-it-back/id6811601309?i=1000797962497",
    youtubeId: "HUEfliCYENs",
    youtubeTitle:
      "We Gave Away the Internet. Now We Can Take It Back. | Connection Ep. 7 with Derek Ross",
    featured: true,
  },
  {
    guid: "9844ee10-bf33-4a25-a1be-ee804ba307e5",
    title: "Nobody Joins a Protocol. They Join a Community. | Connection Ep. 6",
    summary: "Nobody joins a protocol. They join a community.",
    publishedAt: "2026-10-17T23:00:00Z",
    duration: "00:23:07",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/nobody-joins-a-protocol-they-join-a/id6811601309?i=1000796852565",
    youtubeId: "-ywTbdLdaA8",
    youtubeTitle: "Nobody Joins a Protocol. They Join a Community. | Connection Ep. 6",
    featured: true,
  },
  {
    guid: "e268d8ee-a3e7-4231-a70a-f6b918bc0908",
    title: "Can We Build a More Human Internet? | Connection with UTXO",
    summary:
      "What if social media's biggest problem isn't that our networks are too small—but that they've become too big?",
    publishedAt: "2026-10-12T20:23:43Z",
    duration: "00:58:29",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/can-we-build-a-more-human-internet-connection-with-utxo/id6811601309?i=1000796009512",
    youtubeId: "iO2dHp-uluo",
    youtubeTitle: "Can We Build a More Human Internet? | Connection with UTXO",
    featured: false,
  },
  {
    guid: "7ffcccae-3638-4ab1-a29b-42c2e7b34bf5",
    title: "You Can Build Now: AI, Nostr & the Power of Community | Connection Ep. 4",
    summary:
      "What happens when the barrier between having an idea and actually building it starts to disappear?",
    publishedAt: "2026-10-03T23:00:00Z",
    duration: "01:11:17",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/you-can-build-now-ai-nostr-the-power-of/id6811601309?i=1000793028334",
    youtubeId: "Tzz18GCnlFk",
    youtubeTitle: "You Can Build Now: AI, Nostr & the Power of Community | Connection Ep. 4",
    featured: false,
  },
  {
    guid: "829523a5-b58e-4cca-9015-edd679e1335e",
    title: "The Lost Art of Curiosity: What Should We Be Teaching Kids? | Connection Ep. 3",
    summary:
      "What skills will a 10-year-old today actually need when they're working in the 2040s, 2050s, or even 2070s?",
    publishedAt: "2026-09-26T23:00:00Z",
    duration: "00:44:16",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/the-lost-art-of-curiosity-what-should-we-be/id6811601309?i=1000791806532",
    youtubeId: "MUUldCGymjg",
    youtubeTitle: "Are We Teaching Kids the Wrong Skills? | Connection Ep. 3",
    featured: false,
  },
  {
    guid: "e355380f-d425-4cd2-90b6-21e6c6d529a2",
    title: "More Bloom. Less Doom. | Connection Ep. 2",
    summary:
      "We spend a lot of time consuming everything that’s wrong with the world. The latest outrage. The next crisis. Why AI is dangerous. Why the economy is going to collapse.",
    publishedAt: "2026-09-19T23:00:00Z",
    duration: "00:36:14",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/more-bloom-less-doom-connection-ep-2/id6811601309?i=1000790720269",
    youtubeId: "50JROLyIRyA",
    youtubeTitle: "More Bloom. Less Doom. | Connection Ep. 2",
    featured: false,
  },
  {
    guid: "fd7c342e-a9fb-4f88-95e6-369be4678d8d",
    title: "Why I’m Rejecting Doomerism | Connection Ep. 1",
    summary: "We’ve gotten really good at pointing out everything that’s broken.",
    publishedAt: "2026-09-12T22:30:00Z",
    duration: "00:15:15",
    appleUrl:
      "https://podcasts.apple.com/us/podcast/why-im-rejecting-doomerism-connection-ep-1/id6811601309?i=1000789337753",
    youtubeId: "OhQWcGHM-Bg",
    youtubeTitle: "Why I’m Rejecting Doomerism | Connection Ep. 1",
    featured: false,
  },
];

function assertEpisodes(list: ConnectionEpisode[]) {
  const guids = new Set<string>();
  for (const episode of list) {
    if (!episode.title.trim() || !episode.summary.trim()) {
      throw new Error(`Episode ${episode.guid} is missing a title or summary.`);
    }
    if (guids.has(episode.guid)) {
      throw new Error(`Duplicate episode guid: ${episode.guid}`);
    }
    guids.add(episode.guid);
    if (!episode.appleUrl.startsWith("https://")) {
      throw new Error(`Episode ${episode.guid} needs an https Apple link.`);
    }
    if (Number.isNaN(Date.parse(episode.publishedAt))) {
      throw new Error(`Episode ${episode.guid} has an invalid date.`);
    }
    if (episode.youtubeId && !episode.youtubeTitle) {
      throw new Error(`Episode ${episode.guid} has a video id without a YouTube title.`);
    }
  }
}

assertEpisodes(connectionEpisodes);

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
