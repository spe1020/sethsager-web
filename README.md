# sethsager-web

Personal website for Seth Sager: builder, entrepreneur, and systems thinker. Project guidance for contributors and Claude Code sessions lives in [`CLAUDE.md`](./CLAUDE.md).

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # lint + typecheck
npm run build      # production build
npm run start      # serve the production build
```

Requires Node 20+.

## Routes

`/` · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/speaking` · `/about` · `/connection` · `/connect` · `/now`

Also generated: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, and JSON-LD structured data.

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

## Photography

Personal photos live in `public/media/photos/` as responsive WebP + JPEG sets, rendered by `src/components/Photo.tsx`. Which photo goes where, and its alt text, is in `src/content/photos.ts`.

To add or change a photo:

1. Add it to the `PHOTOS` table in `scripts/make-photos.py` (source file name, optional crop, widths).
2. Run `python3 scripts/make-photos.py [SOURCE_DIR]` (needs `pip install pillow`; defaults to `~/Downloads`). It applies the EXIF rotation, crops, **removes all metadata including GPS**, writes the files, and updates `src/content/photos.manifest.json`. Originals are never modified or committed.
3. Add alt text in `src/content/photos.ts` and place it with `<Photo id="…" sizes="…" />`.

`Photo` uses plain `<img>`/`<picture>` with a pre-built `srcset` because the site is a static export (no image optimizer). Width and height attributes prevent layout shift; only the hero loads eagerly.

## Deployment

The site is a standard Next.js app with static output for every route, so it deploys to Vercel (or any Node host running `npm run build && npm run start`). No environment variables are required. Production is deployed from `main` only after explicit approval; the canonical domain is set in `site.url`.
