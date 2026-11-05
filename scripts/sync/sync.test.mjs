// Tests run against real captured feed data (./fixtures) and never touch the network.
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { fetchAppleEpisodeUrls } from "./apple.mjs";
import { fetchText } from "./http.mjs";
import { matchVideos, verifyTitles } from "./match.mjs";
import { fetchPodcast, mergePodcast } from "./podcast.mjs";
import { parseFeed } from "./rss.mjs";
import { discoverFeedUrl, fetchSubstack, mergeSubstack } from "./substack.mjs";
import { discoverVideoIds, verifyVideo } from "./youtube.mjs";
import { runSync } from "./index.mjs";
import { htmlToParagraphs, normalizeUrl, stableStringify } from "./util.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..", "..");
const fx = (name) => fs.readFileSync(path.join(here, "fixtures", name), "utf8");
const config = JSON.parse(fs.readFileSync(path.join(repo, "content", "sources.json"), "utf8"));
const curated = JSON.parse(fs.readFileSync(path.join(repo, "content", "data", "podcast-curated.json"), "utf8"));
const oembed = JSON.parse(fx("youtube-oembed.json"));
const NOW = new Date("2026-11-05T12:00:00Z");
const noWait = { backoffMs: 0 };

/** A fake fetch that serves fixtures. `overrides` replaces or breaks specific URLs. */
function fakeFetch(overrides = {}) {
  const routes = {
    [config.writing.feedUrl]: () => fx("substack.xml"),
    [config.writing.siteUrl]: () => fx("substack-home.html"),
    [config.connection.feedUrl]: () => fx("podcast.xml"),
    "https://itunes.apple.com/lookup?id=6811601309&entity=podcastEpisode&limit=200": () => fx("apple.json"),
    [`${config.connection.youtubeChannelUrl}/videos`]: () => fx("youtube-channel.html"),
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCRVwolMK74R1rpAZLU7EowA": () => ({ status: 404, body: "not found" }),
    ...overrides,
  };
  return async (url) => {
    let handler = routes[url];
    if (!handler && url.startsWith("https://www.youtube.com/oembed")) {
      const id = new URL(url).searchParams.get("url").split("v=")[1];
      handler = () => (oembed[id] ? JSON.stringify(oembed[id]) : { status: 404, body: "Not Found" });
    }
    if (!handler) throw Object.assign(new Error(`unexpected fetch ${url}`), { cause: { code: "TEST" } });
    const out = handler();
    if (out instanceof Error) throw out;
    const { status = 200, body } = typeof out === "string" ? { body: out } : out;
    return new Response(body, { status });
  };
}
const deps = (overrides) => ({ fetchImpl: fakeFetch(overrides), ...noWait });

function tempRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "sync-"));
  fs.mkdirSync(path.join(root, "content", "data"), { recursive: true });
  fs.copyFileSync(path.join(repo, "content", "sources.json"), path.join(root, "content", "sources.json"));
  fs.copyFileSync(path.join(repo, "content", "data", "podcast-curated.json"), path.join(root, "content", "data", "podcast-curated.json"));
  return root;
}
const read = (root, f) => JSON.parse(fs.readFileSync(path.join(root, "content", "data", f), "utf8"));

// ---- helpers ---------------------------------------------------------------

test("htmlToParagraphs: decodes entities, drops tags, keeps paragraph breaks", () => {
  assert.deepEqual(htmlToParagraphs("<p>I&#39;m <strong>here</strong> &amp; now</p><p>Second <a href='x'>link</a></p>"), ["I'm here & now", "Second link"]);
});

test("normalizeUrl ignores query, hash, trailing slash, host case", () => {
  assert.equal(normalizeUrl("https://Zapcooking.Substack.com/p/x/?utm=1#y"), "https://zapcooking.substack.com/p/x");
});

test("fetchText retries transient errors but not 404", async () => {
  let calls = 0;
  const flaky = async () => (++calls < 3 ? new Response("x", { status: 503 }) : new Response("ok"));
  assert.equal((await fetchText("https://x.test", { fetchImpl: flaky, ...noWait })).text, "ok");
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(fetchText("https://x.test", { fetchImpl: async () => (calls++, new Response("", { status: 404 })), ...noWait }), /HTTP 404/);
  assert.equal(calls, 1);
});

test("parseFeed rejects HTML and junk, accepts RSS", () => {
  assert.throws(() => parseFeed("<html><body>Maintenance</body></html>"), /not an RSS or Atom feed/);
  assert.equal(parseFeed(fx("podcast.xml")).items.length, 8);
});

// ---- Substack --------------------------------------------------------------

test("Substack: discovers the feed URL from the home page", async () => {
  assert.equal(await discoverFeedUrl(config.writing.siteUrl, deps()), config.writing.feedUrl);
});

test("Substack: validates the feed, excludes newsletters, links into the publication", async () => {
  const r = await fetchSubstack(config.writing, deps(), NOW);
  assert.equal(r.items.length, 8);
  assert.equal(r.skipped.excluded, 3);
  assert.ok(r.items.every((i) => i.url.startsWith("https://zapcooking.substack.com/p/") && i.title && i.description));
  assert.ok(!r.items.some((i) => /newsletter/i.test(i.title)));
});

test("Substack: falls back to discovery when the configured feed URL is wrong", async () => {
  const bad = { ...config.writing, feedUrl: "https://zapcooking.substack.com/old-feed" };
  const r = await fetchSubstack(bad, deps({ "https://zapcooking.substack.com/old-feed": () => ({ status: 404, body: "" }) }), NOW);
  assert.equal(r.feedUrl, config.writing.feedUrl);
  assert.equal(r.items.length, 8);
});

test("Substack: never exposes drafts, scheduled posts, or foreign links", async () => {
  const item = (title, link, date) => `<item><title>${title}</title><link>${link}</link><pubDate>${date}</pubDate><description>d</description></item>`;
  const xml = `<rss version="2.0"><channel><title>T</title>${[
    item("Real post", "https://zapcooking.substack.com/p/real", "Sat, 24 Oct 2026 02:45:39 GMT"),
    item("A draft", "https://zapcooking.substack.com/publish/post/123", "Sat, 24 Oct 2026 02:45:39 GMT"),
    item("Scheduled", "https://zapcooking.substack.com/p/later", "Sat, 12 Dec 2026 02:45:39 GMT"),
    item("Elsewhere", "https://evil.example/p/x", "Sat, 24 Oct 2026 02:45:39 GMT"),
    item("No date", "https://zapcooking.substack.com/p/nodate", ""),
  ].join("")}</channel></rss>`;
  const r = await fetchSubstack(config.writing, deps({ [config.writing.feedUrl]: () => xml }), NOW);
  assert.deepEqual(r.items.map((i) => i.title), ["Real post"]);
});

test("Substack merge: no duplicates, never drops stored items, newest first", async () => {
  const fetched = await fetchSubstack(config.writing, deps(), NOW);
  const once = mergeSubstack({ items: [] }, fetched);
  const twice = mergeSubstack(once, fetched);
  assert.deepEqual(twice.items, once.items);
  const old = { title: "Old", url: "https://zapcooking.substack.com/p/old", publishedAt: "2024-01-01T00:00:00Z", description: "" };
  const withOld = mergeSubstack({ items: [old] }, fetched);
  assert.equal(withOld.items.length, 9);
  assert.equal(withOld.items.at(-1).url, old.url);
  const dates = withOld.items.map((i) => i.publishedAt);
  assert.deepEqual(dates, [...dates].sort().reverse());
  // same post with a tracking query string and trailing slash is still one post
  const dup = mergeSubstack(once, { items: [{ ...once.items[0], url: `${once.items[0].url}/?utm_source=x` }] });
  assert.equal(dup.items.length, once.items.length);
});

// ---- Podcast, Apple, YouTube ----------------------------------------------

test("Podcast feed contains every curated episode with the same title", async () => {
  const { episodes } = await fetchPodcast(config.connection, deps(), NOW);
  assert.equal(episodes.length, 8);
  for (const c of curated) {
    const e = episodes.find((x) => x.guid === c.guid);
    assert.ok(e, `missing ${c.title}`);
    assert.equal(e.title, c.title);
    assert.ok(e.summary && e.publishedAt && /^\d{2}:\d{2}:\d{2}$/.test(e.duration));
  }
});

test("Apple links are matched by guid and equal the curated links", async () => {
  const apple = await fetchAppleEpisodeUrls(config.connection.appleShowUrl, deps());
  assert.equal(apple.size, 8);
  for (const c of curated) assert.equal(apple.get(c.guid), c.appleUrl);
});

test("Apple lookup ignores results from another show or without an episode id", async () => {
  const body = JSON.stringify({ results: [
    { wrapperType: "podcastEpisode", episodeGuid: "a", trackViewUrl: "https://podcasts.apple.com/us/podcast/x/id999?i=1" },
    { wrapperType: "podcastEpisode", episodeGuid: "b", trackViewUrl: "https://podcasts.apple.com/us/podcast/x/id6811601309" },
    { wrapperType: "podcastEpisode", episodeGuid: "c", trackViewUrl: "https://evil.example/us/podcast/x/id6811601309?i=1" },
    { wrapperType: "podcastEpisode", episodeGuid: "d", trackViewUrl: "https://podcasts.apple.com/us/podcast/x/id6811601309?i=42&uo=4" },
  ] });
  const m = await fetchAppleEpisodeUrls(config.connection.appleShowUrl, deps({ "https://itunes.apple.com/lookup?id=6811601309&entity=podcastEpisode&limit=200": () => body }));
  assert.deepEqual([...m], [["d", "https://podcasts.apple.com/us/podcast/x/id6811601309?i=42"]]);
});

test("YouTube: falls back to the channel page when RSS is down, ids only", async () => {
  const { ids, via } = await discoverVideoIds(config.connection.youtubeChannelUrl, deps());
  assert.equal(ids.length, 10);
  assert.match(via, /channel page/);
});

test("YouTube: oEmbed verification rejects unknown ids and other channels", async () => {
  const [known] = Object.keys(oembed);
  assert.equal((await verifyVideo(known, config.connection.youtubeChannelUrl, deps()))?.title, oembed[known].title);
  assert.equal(await verifyVideo("AAAAAAAAAAA", config.connection.youtubeChannelUrl, deps()), null);
  assert.equal(await verifyVideo("not-an-id", config.connection.youtubeChannelUrl, deps()), null);
  const oembedUrl = "https://www.youtube.com/oembed?url=" + encodeURIComponent("https://www.youtube.com/watch?v=" + known) + "&format=json";
  const other = deps({ [oembedUrl]: () => JSON.stringify({ title: "x", author_url: "https://www.youtube.com/@someoneelse" }) });
  assert.equal(await verifyVideo(known, config.connection.youtubeChannelUrl, other), null);
});

test("Title matching: every automatic match agrees with the hand-verified video ids", async () => {
  const videos = Object.entries(oembed).map(([id, v]) => ({ id, title: v.title }));
  const matches = matchVideos(curated, videos);
  assert.ok(matches.size >= 7, `expected at least 7 matches, got ${matches.size}`);
  for (const [guid, m] of matches) assert.equal(m.id, curated.find((c) => c.guid === guid).youtubeId, "automatic match must equal the curated video id");
  // Ep. 3 is published with a different title on YouTube: it must NOT be guessed.
  const ep3 = curated.find((c) => /Ep\. 3/.test(c.title));
  assert.equal(matches.has(ep3.guid), false);
});

test("Title matching: near-misses and ambiguity are rejected", () => {
  assert.equal(verifyTitles("A Great Talk | Connection Ep. 9", "A Great Talk | Connection Ep. 9"), "exact-title");
  assert.equal(verifyTitles("A Great Talk | Connection Ep. 9", "A Great Talk | Zap Cooking Ep. 9"), "core-title+episode-number");
  assert.equal(verifyTitles("A Great Talk | Connection Ep. 9", "A Great Talk | Connection Ep. 10"), null);
  assert.equal(verifyTitles("A Great Talk", "A Great Talk Part Two"), null);
  assert.equal(verifyTitles("Same | Connection", "Same | Connection Ep. 4"), null);
  const eps = [{ guid: "1", title: "Twin" }, { guid: "2", title: "Twin" }];
  assert.equal(matchVideos(eps, [{ id: "v1", title: "Twin" }]).size, 0);
  assert.equal(matchVideos([{ guid: "1", title: "Twin" }], [{ id: "v1", title: "Twin" }, { id: "v2", title: "Twin" }]).size, 0);
});

test("Podcast merge keeps history and found links", async () => {
  const { episodes } = await fetchPodcast(config.connection, deps(), NOW);
  const apple = new Map([[episodes[0].guid, "https://podcasts.apple.com/us/podcast/x/id6811601309?i=1"]]);
  const store = mergePodcast({ feedUrl: "f", episodes: [] }, { episodes }, apple, new Map([[episodes[0].guid, { id: "RWGIQcMdRL0", title: "t", method: "exact-title" }]]));
  const gone = { guid: "old", title: "Dropped from the feed", summary: "", notes: [], publishedAt: "2020-01-01T00:00:00Z", duration: "" };
  const next = mergePodcast({ ...store, episodes: [...store.episodes, gone] }, { episodes }, new Map(), new Map());
  assert.equal(next.episodes.length, 9);
  assert.equal(next.episodes[0].appleUrl, apple.get(episodes[0].guid));
  assert.equal(next.episodes[0].youtubeId, "RWGIQcMdRL0");
  assert.ok(next.episodes.some((e) => e.guid === "old"));
});

// ---- Whole sync (temp repo) -------------------------------------------------

test("runSync: first run builds stores, second run changes nothing (idempotent, deterministic)", async () => {
  const root = tempRoot();
  const first = await runSync({ root, deps: deps(), now: NOW });
  assert.equal(first.changed, true);
  assert.equal(first.problems.length, 0);
  const snap = ["substack.json", "podcast.json"].map((f) => fs.readFileSync(path.join(root, "content", "data", f), "utf8"));
  const second = await runSync({ root, deps: deps(), now: new Date("2026-11-06T00:00:00Z") });
  assert.equal(second.changed, false);
  assert.deepEqual(["substack.json", "podcast.json"].map((f) => fs.readFileSync(path.join(root, "content", "data", f), "utf8")), snap, "files must be byte-identical when nothing changed");
  assert.equal(read(root, "podcast.json").episodes.length, 8);
  assert.equal(read(root, "substack.json").items.length, 8);
});

test("runSync: a full outage keeps the last good data and does not throw", async () => {
  const root = tempRoot();
  await runSync({ root, deps: deps(), now: NOW });
  const before = ["substack.json", "podcast.json"].map((f) => fs.readFileSync(path.join(root, "content", "data", f), "utf8"));
  const down = async () => { throw Object.assign(new Error("offline"), { cause: { code: "ENOTFOUND" } }); };
  const r = await runSync({ root, deps: { fetchImpl: down, ...noWait }, now: new Date("2026-11-06T00:00:00Z") });
  assert.equal(r.changed, false);
  assert.ok(r.problems.length >= 3, `expected problems reported, got ${r.problems.length}`);
  assert.deepEqual(["substack.json", "podcast.json"].map((f) => fs.readFileSync(path.join(root, "content", "data", f), "utf8")), before);
});

test("runSync: a feed that returns an HTML error page is rejected, not stored", async () => {
  const root = tempRoot();
  const html = () => "<html><body>502 Bad Gateway</body></html>";
  const r = await runSync({ root, deps: deps({ [config.writing.feedUrl]: html, [config.connection.feedUrl]: html }), now: NOW });
  assert.ok(r.problems.some((p) => /Substack/.test(p)) && r.problems.some((p) => /Podcast feed/.test(p)));
  assert.equal(fs.existsSync(path.join(root, "content", "data", "substack.json")), false, "nothing invalid was stored");
});

test("runSync: a new post and a new episode are added, newest first, with no duplicates; dropped items stay", async () => {
  const root = tempRoot();
  await runSync({ root, deps: deps(), now: NOW });
  const feed = fx("substack.xml").replace("<item>", `<item><title>Brand new essay</title><link>https://zapcooking.substack.com/p/brand-new</link><pubDate>Wed, 04 Nov 2026 12:00:00 GMT</pubDate><description>Fresh</description></item><item>`);
  const pod = fx("podcast.xml").replace("<item>", `<item><title><![CDATA[Episode Nine | Connection Ep. 9]]></title><description><![CDATA[<p>The ninth.</p><p>Notes here.</p>]]></description><guid isPermaLink="false">guid-9</guid><pubDate>Wed, 04 Nov 2026 23:00:00 GMT</pubDate><itunes:duration>00:42:10</itunes:duration></item><item>`).replace(/<item>(?![\s\S]*<item>)[\s\S]*?<\/item>/, ""); // also drop the oldest item from the feed
  await runSync({ root, deps: deps({ [config.writing.feedUrl]: () => feed, [config.connection.feedUrl]: () => pod }), now: NOW });
  const w = read(root, "substack.json").items;
  assert.equal(w[0].title, "Brand new essay");
  assert.equal(new Set(w.map((i) => normalizeUrl(i.url))).size, w.length);
  const eps = read(root, "podcast.json").episodes;
  assert.equal(eps[0].title, "Episode Nine | Connection Ep. 9");
  assert.deepEqual(eps[0].notes, ["Notes here."]);
  assert.equal(eps.length, 9, "the episode dropped from the feed is preserved");
  assert.ok(eps.some((e) => /Ep\. 1$/.test(e.title)));
  const dates = eps.map((e) => e.publishedAt);
  assert.deepEqual(dates, [...dates].sort().reverse());
});

test("runSync: attaches a YouTube video only when verified, otherwise leaves it blank", async () => {
  const root = tempRoot();
  fs.writeFileSync(path.join(root, "content", "data", "podcast-curated.json"), "[]\n"); // no curated videos
  await runSync({ root, deps: deps(), now: NOW });
  const eps = read(root, "podcast.json").episodes;
  const withVideo = eps.filter((e) => e.youtubeId);
  assert.ok(withVideo.length >= 7);
  for (const e of withVideo) {
    assert.equal(e.youtubeId, curated.find((c) => c.guid === e.guid).youtubeId);
    assert.ok(e.youtubeMatch);
  }
  assert.equal(eps.find((e) => /Ep\. 3/.test(e.title)).youtubeId, undefined);
});

test("runSync: YouTube being down leaves existing links untouched", async () => {
  const root = tempRoot();
  fs.writeFileSync(path.join(root, "content", "data", "podcast-curated.json"), "[]\n");
  const down = { [`${config.connection.youtubeChannelUrl}/videos`]: () => ({ status: 500, body: "" }) };
  const r = await runSync({ root, deps: deps(down), now: NOW });
  assert.ok(r.problems.some((p) => /YouTube/.test(p)));
  assert.equal(read(root, "podcast.json").episodes.filter((e) => e.youtubeId).length, 0);
  assert.equal(read(root, "podcast.json").episodes.length, 8);
});

test("stableStringify is deterministic", () => {
  assert.equal(stableStringify({ a: 1 }), '{\n  "a": 1\n}\n');
});
