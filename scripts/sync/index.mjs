#!/usr/bin/env node
// Content sync: pulls the Substack and podcast feeds and writes committed JSON
// snapshots the static site is built from. Nothing here runs at request time.
//
//   npm run sync            update content/data/*.json
//   npm run sync -- --dry-run   report what would change, write nothing
//
// A failing source never fails the run: it is reported as a warning (visible
// in the Actions log) and the last good snapshot stays in place.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchAppleEpisodeUrls } from "./apple.mjs";
import { discoverVideoIds, verifyVideo } from "./youtube.mjs";
import { matchVideos } from "./match.mjs";
import { fetchPodcast, mergePodcast } from "./podcast.mjs";
import { fetchSubstack, mergeSubstack } from "./substack.mjs";
import { fail, notice, stableStringify, warn } from "./util.mjs";

const readJson = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT" && fallback !== undefined) return fallback;
    throw new Error(`cannot read ${file}: ${err.message}`);
  }
};

/** Write only when the content (ignoring updatedAt) changed. Returns true if it did. */
function save(file, body, previous, now, dryRun) {
  const before = { ...previous };
  delete before.updatedAt;
  if (stableStringify(before) === stableStringify(body)) return false;
  if (!dryRun) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, stableStringify({ ...body, updatedAt: now.toISOString().replace(/\.\d{3}Z$/, "Z") }));
  }
  return true;
}

export async function runSync({ root, deps = {}, now = new Date(), dryRun = false } = {}) {
  const dataDir = path.join(root, "content", "data");
  const config = readJson(path.join(root, "content", "sources.json"));
  const lines = [];
  const problems = [];
  let changed = false;
  const report = (line) => lines.push(line);
  const problem = (title, msg) => {
    problems.push(`${title}: ${msg}`);
    warn(title, msg);
  };

  // ---- Writing (Substack) -------------------------------------------------
  const substackFile = path.join(dataDir, "substack.json");
  const storedWriting = readJson(substackFile, { feedUrl: config.writing.feedUrl, items: [] });
  try {
    const fetched = await fetchSubstack(config.writing, deps, now);
    const merged = mergeSubstack(storedWriting, fetched);
    const added = merged.items.length - storedWriting.items.length;
    const did = save(substackFile, merged, storedWriting, now, dryRun);
    changed ||= did;
    report(`Writing: ${fetched.items.length} in feed (skipped ${fetched.skipped.excluded} excluded, ${fetched.skipped.invalid} invalid, ${fetched.skipped.future} future), ${added} new, ${merged.items.length} stored${did ? " — updated" : " — no change"}`);
  } catch (err) {
    problem("Substack sync failed", `${err.message}. Keeping ${storedWriting.items.length} stored articles.`);
    report(`Writing: FAILED, kept ${storedWriting.items.length} stored articles`);
  }

  // ---- Connection (podcast RSS + Apple + YouTube) -------------------------
  const podcastFile = path.join(dataDir, "podcast.json");
  const storedPodcast = readJson(podcastFile, { feedUrl: config.connection.feedUrl, episodes: [] });
  const curated = readJson(path.join(dataDir, "podcast-curated.json"), []);
  const curatedByGuid = new Map(curated.map((e) => [e.guid, e]));

  let fetchedPodcast = { episodes: [], skipped: 0 };
  let feedOk = true;
  try {
    fetchedPodcast = await fetchPodcast(config.connection, deps, now);
  } catch (err) {
    feedOk = false;
    problem("Podcast feed failed", `${err.message}. Keeping ${storedPodcast.episodes.length} stored episodes.`);
  }
  let working = mergePodcast({ ...storedPodcast, feedUrl: config.connection.feedUrl }, fetchedPodcast);

  // Apple episode links, matched by RSS guid.
  let apple = new Map();
  try {
    apple = await fetchAppleEpisodeUrls(config.connection.appleShowUrl, deps);
  } catch (err) {
    problem("Apple Podcasts lookup failed", `${err.message}. Existing Apple links are kept.`);
  }

  // YouTube: only for episodes that have no video yet, and only verified matches.
  const hasVideo = (ep) => Boolean(ep.youtubeId || curatedByGuid.get(ep.guid)?.youtubeId);
  const without = working.episodes.filter((ep) => !hasVideo(ep));
  let videos = new Map();
  let ytNote = "all episodes already have a video";
  if (without.length > 0) {
    try {
      const taken = new Set(working.episodes.flatMap((ep) => [ep.youtubeId, curatedByGuid.get(ep.guid)?.youtubeId]).filter(Boolean));
      const { ids, via } = await discoverVideoIds(config.connection.youtubeChannelUrl, deps);
      const verified = (await Promise.all(ids.filter((id) => !taken.has(id)).map((id) => verifyVideo(id, config.connection.youtubeChannelUrl, deps)))).filter(Boolean);
      videos = matchVideos(without, verified);
      ytNote = `${without.length} episode(s) without a video, ${ids.length} channel videos via ${via}, ${verified.length} unattached verified, ${videos.size} matched`;
    } catch (err) {
      problem("YouTube lookup failed", `${err.message}. No video links were added or changed.`);
      ytNote = "lookup failed, nothing changed";
    }
  }

  const mergedPodcast = mergePodcast({ ...storedPodcast, feedUrl: config.connection.feedUrl }, fetchedPodcast, apple, videos);
  const added = mergedPodcast.episodes.length - storedPodcast.episodes.length;
  const didPodcast = save(podcastFile, mergedPodcast, storedPodcast, now, dryRun);
  changed ||= didPodcast;
  report(`Connection: ${feedOk ? `${fetchedPodcast.episodes.length} in feed` : "feed FAILED"}, ${added} new, ${mergedPodcast.episodes.length} stored, ${apple.size} Apple links found${didPodcast ? " — updated" : " — no change"}`);
  report(`YouTube: ${ytNote}`);

  // ---- Summary -------------------------------------------------------------
  const summary = [`### Content sync${dryRun ? " (dry run)" : ""}`, ...lines.map((l) => `- ${l}`), ...(problems.length ? ["", "**Problems**", ...problems.map((p) => `- ⚠️ ${p}`)] : []), "", changed ? "**Result: content changed**" : "**Result: no changes**"].join("\n");
  console.log(summary.replaceAll("###", "").replaceAll("**", "").trim());
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  if (problems.length) notice(`${problems.length} source problem(s); the site keeps the last good data.`);
  return { changed, problems, lines };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
  runSync({ root, dryRun: process.argv.includes("--dry-run") }).catch((err) => {
    fail("Content sync crashed", err.stack ?? String(err));
    process.exit(1);
  });
}
