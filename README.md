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

`/` · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/about` · `/connection` · `/connect` · `/now`

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

Drafts appear on `/writing` labeled as in progress, have no page, and are left out of the sitemap. The six current files are drafts with placeholder text only.

### Still needed from Seth

- A real portrait: add it to `public/media` and set `site.portrait` in `src/content/site.ts`.
- A public contact email: set `site.email`. Until then `/connect` says none is published.

## Deployment

The site is a standard Next.js app with static output for every route, so it deploys to Vercel (or any Node host running `npm run build && npm run start`). No environment variables are required. Production is deployed from `main` only after explicit approval; the canonical domain is set in `site.url`.
