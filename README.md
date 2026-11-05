# sethsager-web

Personal website for Seth Sager — builder, entrepreneur, and systems thinker.

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Content

Portfolio projects live in `src/content/projects.ts`. That module is the only project list: the homepage, work index, and `/work/[slug]` routes read it. `detailHref` is the internal page. `websiteUrl` and `links` leave the site.

Connection episodes live in `src/content/connection.ts`. They were taken from the public podcast feed and the YouTube channel. The show page is `/connection`.
