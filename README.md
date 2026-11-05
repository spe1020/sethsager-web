# sethsager-web

Personal website for Seth Sager: builder, entrepreneur, and systems thinker. Project guidance for contributors and Claude Code sessions lives in [`CLAUDE.md`](./CLAUDE.md).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck
npm run sync       # pull the Substack and podcast feeds into content/data (see below)
npm test           # offline tests for the sync logic
npm run build      # static export to out/
npm run preview    # serve out/ at http://localhost:3000 (run build first)
```

Requires Node 20.9+ (CI uses Node 24).

## Routes

`/` · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/speaking` · `/about` · `/connection` · `/connect` · `/now`

Also generated: `/sitemap.xml`, `/robots.txt`, a static `/og-image.png`, a `/404.html`, and JSON-LD structured data.

## Content

| What | Where |
| --- | --- |
| Projects (home, `/work`, case studies) | `src/content/projects.ts` |
| Connection episodes (synced) | `content/data/podcast.json`, with hand-verified links in `content/data/podcast-curated.json` |
| Substack articles (synced) | `content/data/substack.json` |
| Feed sources and rules | `content/sources.json` |
| Site config, nav, social links, portrait, email | `src/content/site.ts` |
| `/now` | `src/content/now.ts` |
| Essays | `content/writing/*.md` |

`detailHref` is a project's internal page; `websiteUrl` and `links` leave the site.

### Publishing an essay

Create `content/writing/my-slug.md`:

```md
---
title: My title
date: 2026-11-04
theme: building        # building | thinking | connecting
status: published      # draft | published
summary: One or two sentences.
---

Markdown body…
```

Drafts appear on `/writing` labeled as in progress, have no page, and are left out of the sitemap. Add `canonical: https://…` for a piece first published elsewhere: it is mirrored as a native page, marked "Originally published", and search engines are pointed at the original (remove the line to make this site canonical). The eight current essays are mirrored this way. New Substack posts do **not** need this: they appear automatically as links to the original (see "Automatic content updates"). Add a Markdown mirror only when you want the full text on this site.

## Automatic content updates

Publish once, on the original platform, and the site follows: articles from **Substack** (https://zapcooking.substack.com) and episodes of **Connection** (podcast RSS, Apple Podcasts, YouTube). There is no database, no runtime API, and no outside automation service. The site stays fully static.

### How it works

```
every 6 hours (and on demand)            ┌─ no change ─▶ stop (nothing committed, nothing deployed)
Sync content workflow ─▶ npm run sync ───┤
                                         └─ changed ─▶ lint + typecheck + build ─▶ commit content/data ─▶ deploy.yml ─▶ GitHub Pages
```

1. `.github/workflows/sync-content.yml` runs at 00:17, 06:17, 12:17 and 18:17 UTC, or on demand from *Actions* → *Sync content* → *Run workflow*.
2. `scripts/sync` fetches each source, validates it, and merges it into **committed JSON snapshots** in `content/data/`. The site is built only from those files, never from a live request, so builds are reproducible and a feed outage cannot change or break the site.
3. If the snapshots changed, the workflow proves the site still builds, commits `content/data/` to `main` as `github-actions[bot]`, and starts `deploy.yml`. (A push made with the built-in token does not trigger other workflows, so the deploy is started explicitly.) If nothing changed it stops. Data files are only rewritten when content really changed, so there is no commit noise.

### What is synced

| Source | Used for | Stored in |
| --- | --- | --- |
| Substack RSS (feed URL is validated; if it ever fails, the feed is rediscovered from the publication's home page) | title, date, description, link to the original | `content/data/substack.json` |
| Podcast RSS (`https://anchor.fm/s/1172d9cb4/podcast/rss`) | episode title, show notes, date, duration | `content/data/podcast.json` |
| Apple's public iTunes Lookup API | episode Apple Podcasts links, matched by the episode's RSS `guid` | `content/data/podcast.json` |
| YouTube channel + oEmbed | episode video, **only when verified** (below) | `content/data/podcast.json` |

Rules for the data:

- **Accumulating:** each run adds new items and updates existing ones. Nothing is ever removed, so history survives even when a feed only lists recent items.
- **No duplicates:** articles are keyed by normalized URL, episodes by `guid`. A feed article that matches a local Markdown post (same `canonical` URL or same title) is shown once, as the local post.
- **Newest first** everywhere.
- **No drafts:** only items in the public feed are ever read. As extra guards an article must link into the publication, have a valid date, and not be dated in the future. Titles matching `excludeTitlePatterns` in `content/sources.json` are skipped; this currently hides the three "Zap Cooking Newsletter" product-update issues.
- **No republishing:** feed articles show title, date, description, and a link to the original. Full text appears on this site only for the Markdown mirrors in `content/writing/`, which are added by hand (see "Publishing an essay").

### YouTube matching (never guessed)

The channel's video list only supplies candidate ids. Each candidate is checked with YouTube's oEmbed endpoint, which returns the exact title and the owning channel and rejects ids that do not exist. A video is attached to an episode only if it is on the `@ZapCooking` channel **and** one of these holds:

1. its title is identical to the episode title after normalizing case, punctuation, quotes, and `&`; or
2. the part before `|` is identical **and** both titles carry the same `Ep. N`.

If a video fits two episodes, or an episode fits two videos, both are rejected. Anything else stays unlinked: the Apple Podcasts link and the show-level YouTube link are always there. If YouTube is unreachable, existing links are left exactly as they are.

### Curated content

`content/data/podcast-curated.json` holds links that were verified by hand (currently all eight YouTube videos, plus their Apple links). They **always win** over synced values and are never overwritten. For example, Episode 3 is titled differently on YouTube, so it can only be linked by hand. To pin or correct a link for an episode, add or edit its entry (`guid` plus `youtubeId`, `youtubeTitle`, and optionally `appleUrl`). Titles, notes, dates, and durations come from the feed so edits made in the podcast host flow through automatically.

### When something goes wrong

A failing source does **not** fail the workflow or block deployment. It shows up as a yellow warning annotation on the run, with details in the job summary, and the site keeps the last good data. The job only goes red if the site would not build with the new data, and in that case nothing is committed. Scheduled workflows are paused by GitHub after 60 days without repository activity; sync commits count as activity, and a manual run re-enables it.

### Running and changing it

```bash
npm run sync              # update content/data from the live feeds
npm run sync -- --dry-run # report what would change, write nothing
npm test                  # offline tests with captured real feed data (no network)
```

Sources, the feed URLs, and the exclude patterns are in `content/sources.json`. The tests in `scripts/sync/` replay real captured responses (`scripts/sync/fixtures/`), including a total outage, a garbage feed, a YouTube outage, new and dropped items, and check the automatic YouTube matches against the hand-verified ids.

The sync commits straight to `main`. If you add branch protection that requires pull requests, allow `github-actions[bot]` to bypass it for this workflow, or the commit step will fail.

## Photography

Personal photos live in `public/media/photos/` as responsive WebP + JPEG sets, rendered by `src/components/Photo.tsx`. Which photo goes where, and its alt text, is in `src/content/photos.ts`.

To add or change a photo:

1. Add it to the `PHOTOS` table in `scripts/make-photos.py` (source file name, optional crop, widths).
2. Run `python3 scripts/make-photos.py [SOURCE_DIR]` (needs `pip install pillow`; defaults to `~/Downloads`). It applies the EXIF rotation, crops, **removes all metadata including GPS**, writes the files, and updates `src/content/photos.manifest.json`. Originals are never modified or committed.
3. Add alt text in `src/content/photos.ts` and place it with `<Photo id="…" sizes="…" />`.

`Photo` uses plain `<img>`/`<picture>` with a pre-built `srcset` because the site is a static export (no image optimizer). Width and height attributes prevent layout shift; only the hero loads eagerly.

## Deployment

SethSager.com is a **static site hosted on GitHub Pages**. `next build` writes the whole site to `out/`, and a GitHub Actions workflow (`.github/workflows/deploy.yml`) publishes it.

**Every push to `main` deploys to production.** Merge to `main` only with Seth's approval.

### How a deploy works

On a push to `main` (or a manual run from the Actions tab) the workflow:

1. checks out the repo and installs Node 24 and dependencies with `npm ci`
2. runs `npm run lint`, `npm run typecheck`, and `npm run build`
3. uploads `out/` with `actions/upload-pages-artifact`
4. deploys it with `actions/deploy-pages` to the `github-pages` environment

If any check fails, nothing is deployed and the previous version stays live. Runs are serialized (`concurrency: pages`), so two merges in a row deploy in order.

### One-time setup (Seth)

The workflow does nothing useful until Pages is enabled, and the site must have its custom domain, because pages and assets use root-relative URLs (`/_next/...`, `/media/...`). The default `https://spe1020.github.io/sethsager-web/` address would not load assets correctly.

1. **Enable Pages.** Repo → *Settings* → *Pages* → *Build and deployment* → **Source: GitHub Actions**.
2. **Verify the domain (recommended).** GitHub account → *Settings* → *Pages* → *Add a domain* → `sethsager.com`, and add the TXT record GitHub shows. This stops anyone else from claiming the domain.
3. **Set the custom domain.** Repo → *Settings* → *Pages* → *Custom domain* → `sethsager.com` → *Save*. Actions-based deployments ignore a `CNAME` file; this setting is what counts.
4. **Point DNS at GitHub Pages** at the domain registrar. Check GitHub's current values in their [custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site) before copying:
   - apex `sethsager.com`: `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and optionally `AAAA` records to `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - `www`: a `CNAME` to `spe1020.github.io`
   - Remove any other `A`/`AAAA`/`CNAME` records for those names. **Note the current DNS values first** so you can roll back.
5. **Enforce HTTPS.** Once GitHub's DNS check passes (it can take minutes to hours), tick *Enforce HTTPS* in *Settings* → *Pages*.
6. **Deploy.** Run the workflow from *Actions* → *Deploy to GitHub Pages* → *Run workflow*, or push to `main`.

### Rolling back

Pick the fastest that fits:

- **Re-deploy a known-good version.** *Actions* → *Deploy to GitHub Pages* → open an earlier green run → *Re-run all jobs*. It rebuilds and redeploys that exact commit.
- **Revert the change.** `git revert -m 1 <merge-commit-sha>` on a branch, open a PR, merge it. The push to `main` deploys the revert.
- **Take the site offline or switch hosts.** Change the DNS records back to the values you noted in setup step 4 (or unpublish in *Settings* → *Pages*).

### Testing the static output locally

```bash
npm run build
npm run preview   # python3 http.server over out/
```

`preview` serves `out/` as plain files, which is what Pages does: `/work/` serves `work/index.html`, and `/work` redirects to `/work/`. It does not serve `404.html` for missing pages; GitHub Pages does. Avoid `npx serve`: its default "clean URLs" behavior differs from Pages.

### Static export: requirements and limitations

`next.config.ts` sets `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`. Keep these true:

- **No server runtime.** No middleware, rewrites, custom headers, `redirects()` in the config, API routes, server actions, ISR, or cookies/headers APIs. `next start` does not apply.
- **Redirects** are plain HTML pages with a `<meta http-equiv="refresh">` (see `/work/connection/`, which forwards to `/connection/`). GitHub Pages cannot send HTTP redirects other than adding a trailing slash.
- **Dynamic routes** must list every page in `generateStaticParams()` and keep `dynamicParams = false`.
- **Metadata routes** (`sitemap.ts`, `robots.ts`) need `export const dynamic = "force-static"`.
- **Images are not optimized at build or request time.** Put already-sized, compressed files in `public/media` (keep each under roughly 150 KB). `next/image` still gives dimensions and lazy loading.
- **The social image is a real file**, `public/og-image.png` (1200×630). Pages serves content types by file extension, so Next's extensionless generated image would be served as a download. To change it, replace the file. The original generator (`src/app/opengraph-image.tsx`) is in git history.
- **Trailing slashes everywhere.** Canonical URLs and sitemap entries end in `/`, matching what Pages serves.
- **404.** `out/404.html` is served for any unknown URL with a 404 status.
- **No headers control.** Cache lifetimes and security headers are GitHub's defaults.
- Fonts are downloaded at build time and self-hosted. All external resources (YouTube privacy player, Substack, Apple Podcasts) use `https`.
