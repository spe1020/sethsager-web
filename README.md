# sethsager-web

Personal website for Seth Sager: builder, entrepreneur, and systems thinker. Project guidance for contributors and Claude Code sessions lives in [`CLAUDE.md`](./CLAUDE.md).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck
npm run build      # static export to out/
npm run preview    # serve out/ at http://localhost:3000 (run build first)
```

Requires Node 20.9+ (CI uses Node 24).

## Routes

`/` · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/about` · `/connection` · `/connect` · `/now`

Also generated: `/sitemap.xml`, `/robots.txt`, a static `/og-image.png`, a `/404.html`, and JSON-LD structured data.

## Content

| What | Where |
| --- | --- |
| Projects (home, `/work`, case studies) | `src/content/projects.ts` |
| Connection episodes | `src/content/connection.ts` |
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

Drafts appear on `/writing` labeled as in progress, have no page, and are left out of the sitemap. Add `canonical: https://…` for a piece first published elsewhere: it is mirrored as a native page, marked "Originally published", and search engines are pointed at the original (remove the line to make this site canonical). The current essays are mirrored from the Zap Cooking Substack feed; product newsletter issues are not included.

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
