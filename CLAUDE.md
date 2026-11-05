# CLAUDE.md — SethSager.com

Persistent guide for every Claude Code session in this repository. Keep it current when architecture, design direction, or conventions materially change. Never put secrets, credentials, or sensitive personal information here.

## Project identity

**Name:** SethSager.com

**Purpose:** Personal digital headquarters for Seth Sager, an entrepreneur, builder, and systems thinker.

**Hero (established — do not revert):** "There’s always a better way."

**Brand line:** "Curious by nature. Builder by choice." (hero eyebrow)

**Core belief:** Ideas are easy; building is the interesting part. This is a private compass, not the hero line.

**Positioning (hero copy):** I’m Seth. I build products, rethink systems, and explore ideas that make technology more useful and life a little more human.

This is **not** a corporate résumé, a consulting-agency landing page, or a promotional site for one venture. It is a personal platform connecting entrepreneurial projects, professional experience, writing, experiments, and ideas.

## Established brand guidelines

Decisions Seth has made. Treat them as fixed unless he changes them.

- **Hero:** "There’s always a better way." Eyebrow: "Curious by nature. Builder by choice." Never go back to "Ideas are easy. Building is the interesting part."
- **Tone:** simple, confident, conversational, curious, and grounded.
- **Avoid:** cheesy slogans, excessive brand philosophy, corporate language, and forced connections between projects. Do not explain how the website works.
- **Projects section:** eyebrow "What I’m building", headline "Things I’m working on.", description "A few projects, ideas, and communities I’ve helped bring to life." Never put project counts in headings; the portfolio will keep growing.
- **Nostr Valley is an annual event Seth co-founded**, a community initiative, not a software product.

## Brand personality

- Curious and intellectually independent
- Builder-first, execution-oriented
- Thoughtful and practical
- Human, approachable, authentic
- Confident without being pretentious
- Slightly unconventional
- Optimistic about technology without being blindly enthusiastic

Avoid corporate jargon, exaggerated accomplishments, buzzwords, and generic marketing language.

## Design principles

Modern editorial design with the sensibility of an independent technology founder.

- Warm ivory backgrounds, deep charcoal type, restrained burnt-orange accents
- Sophisticated typography (Fraunces display, Outfit text)
- Generous whitespace, strong hierarchy
- Subtle, purposeful interaction; honor `prefers-reduced-motion`
- Mobile-first
- Authentic imagery only

Avoid: generic SaaS templates, heavy gradients, glassmorphism, decorative particles, stock photography, unnecessary visual complexity.

Design tokens live as CSS custom properties at the top of `src/app/globals.css`. Use them; do not hard-code new colors.

## Technology

- Next.js App Router, React, TypeScript (strict), plain CSS in `src/app/globals.css`
- Writing is Markdown with frontmatter, rendered on the server with `marked`
- No database, no CMS, no CSS framework. Add dependencies only with a clear reason.

Engineering standards:

- Server components by default. `"use client"` only where state or browser APIs require it (currently `SiteHeader`, `PrivacyVideo`).
- Separate content (`src/content`) from presentation (`src/components`, `src/app`).
- Prefer simple solutions over abstractions.
- Accessibility: landmarks, one `h1` per page, visible focus, 44px targets, skip link, meaningful alt text.
- Optimize images (`next/image`) and fonts (`next/font`).
- Protect Core Web Vitals: no layout shift, minimal JS.

### Layout of the repo

```
src/app/            routes, metadata, sitemap, robots, OG images
src/components/     reusable presentation components
src/content/        typed content: site.ts, projects.ts, connection.ts, now.ts, writing.ts
content/writing/    Markdown essays (frontmatter + body)
public/media/       project imagery
```

### Routes

`/` Home · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/about` · `/connection` · `/connect` · `/now`

`/connection` is the Connection project's detail page (see `detailHref` in `projects.ts`); `/work/connection` redirects there.

### Publishing writing

Add `content/writing/<slug>.md` with frontmatter: `title`, `date` (YYYY-MM-DD), `summary`, `theme` (`building` | `thinking` | `connecting`), `status` (`draft` | `published`), optional `canonical` (original URL for pieces first published elsewhere, e.g. Substack; the page is a mirror with a canonical link and an "Originally published" note). Drafts are listed on `/writing` as clearly labeled drafts with no article page and are excluded from the sitemap. Published posts get a page, metadata, and structured data automatically.

## Current projects (keep accurate)

- **Zap Cooking** — https://zap.cooking — Open social cooking platform integrating recipes, community, AI, and Bitcoin payments.
- **Zap Books** — https://zapbooks.io — Privacy-first accounting software with AI assistance and user-controlled financial records. Private beta.
- **LoopSignal** — https://www.loopsignal.co — Manufacturing problem-solving software connecting evidence, corrective actions, verification, and organizational learning.
- **Grateful Day** — https://gratefulday.space — Daily gratitude, mindfulness, and reflection.
- **Nostr Valley** — https://nostrvalley.com — Annual gathering in State College, Pennsylvania for people interested in Nostr, Bitcoin, and the open internet. Seth is a co-founder. Third annual event: October 17, 2026, Happy Valley Brewing Company. Not a software product; status is "Annual event".
- **Connection** — Podcast on technology, relationships, creativity, community, and the human experience. YouTube: https://www.youtube.com/@ZapCooking · Apple Podcasts: https://podcasts.apple.com/us/podcast/connection/id6811601309

Projects are defined once in `src/content/projects.ts`. Internal case-study navigation (`detailHref`) stays distinct from external links (`websiteUrl`, `links`).

**Do not fabricate** metrics, testimonials, product functionality, published content, or personal details. If a fact is unknown, leave a clearly marked placeholder (e.g. `site.portrait` stays null until a real photo exists) and tell Seth.

## Content philosophy

Three themes: **Building** (products, software, experimentation, open technology), **Thinking** (systems, manufacturing, leadership, AI, economics, society), **Connecting** (relationships, communication, communities, education, podcasting).

Write naturally, personally, curiously, and grounded. Clear language, real observations, real experience. Not self-promotion.

## Development workflow

For every meaningful feature:

1. Inspect the relevant existing code.
2. Understand dependencies and architecture.
3. Make the smallest maintainable improvement.
4. Test functionality.
5. Verify responsive behavior.
6. Check accessibility.
7. Run `npm run lint`, `npm run typecheck`, and `npm run build`.
8. Summarize changes and outstanding issues.

Work in feature branches and open pull requests. **Never merge to `main` or deploy to production without Seth's explicit approval.**

## Commands

```bash
npm run dev        # local development
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run check      # lint + typecheck
npm run build      # production build
```
