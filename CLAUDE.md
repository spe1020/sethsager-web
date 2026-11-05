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

Modern editorial design with the sensibility of an independent technology founder. The direction is **Modern Blue**.

**Palette** (CSS custom properties at the top of `src/app/globals.css`; never hard-code colors):

| Token | Hex | Use |
| --- | --- | --- |
| `--midnight` | `#18263B` | Primary text, dark bands, primary buttons |
| `--blue` | `#3268E8` | Accent, arrow segments, focus ring, nav indicator |
| `--sky` | `#78BAEF` | Accent on dark surfaces |
| `--ice` | `#EAF2FC` | Light tint: secondary buttons, bands, badges |
| `--canvas` | `#F7F9FC` | Page background |
| `--atlantic` | `#101F36` | Deep Atlantic. Reserved for the full-width experience band (`Band`) |
| `--blue-ink` | `#234FC4` | Blue for text/links on light backgrounds (6.6:1). Plain `--blue` on canvas is only 4.6:1, so use it for large text and fills |

- Sophisticated typography (Fraunces display, Outfit text)
- Generous whitespace, strong hierarchy
- Crisp geometry: 4px radius on controls and badges, 10px on cards, 8px on images. No fully rounded pills.
- Subtle, purposeful interaction; honor `prefers-reduced-motion`
- Mobile-first
- Authentic imagery only

Avoid: generic SaaS templates, gradients, glows, heavy shadows, glassmorphism, decorative particles, stock photography, unnecessary visual complexity.

## Interaction system

All interactive components live in `src/components/Actions.tsx` (plus `ProjectAction.tsx`). Use them; do not hand-roll links or buttons.

| Component | Use for |
| --- | --- |
| `PrimaryAction` | The one main CTA in a region. Split button: midnight label + separate blue arrow segment. |
| `SecondaryAction` | Supporting action. Ice fill, outlined, inline arrow. |
| `EditorialLink` | Navigation links that are not CTAs ("All work", "More about me"). Text + arrow over a fine divider. `direction="left"` for back links. |
| `ExternalLink` | Any destination off this site. Editorial link with a diagonal arrow. Opens a new tab. |
| `ProjectAction` | Project card links: "The story behind it" (internal, right arrow) and "Visit [Project]" (external, diagonal arrow). |

Rules:

- **Semantics:** destinations are real links (`next/link`, or `<a>` for external and `mailto:`). Things that act (retry, play) are real `<button>`s. Pass `onClick` instead of `href` to get a button.
- **Arrows:** right arrow = internal, diagonal arrow = external, left arrow = back. Hover moves the arrow 3–5px (right/left 4px, diagonal 3px,-3px).
- **Don't over-button:** buttons are for CTAs. Everything else is an `EditorialLink` or a plain in-text link. In-text links stay as ordinary underlined links.
- **Cards:** one internal link per card. It stretches over the card (`stretch` prop), so the card is clickable. External links sit above that overlay (`z-index`), so they never get swallowed. Do not add a second internal link to a card.
- **Motion:** 180ms, `transform` and `color` only. No animation library. Reduced motion removes all transforms and transitions (see the end of `globals.css`).
- **Accessibility:** touch targets are at least 44px (buttons 48px). Focus is a 2px blue ring (sky on dark). External links announce "(opens in a new tab)". Arrows are `aria-hidden`.
- **Tone:** `tone="dark"` variants exist for midnight surfaces.
- **Mobile navigation:** below 860px the header shows a Menu button (`aria-expanded`, `aria-controls`, Escape closes and returns focus to it). Without JavaScript the menu is shown open.

## Technology

- Next.js App Router, React, TypeScript (strict), plain CSS in `src/app/globals.css`
- Writing is Markdown with frontmatter, rendered at build time with `marked`
- **Hosting: GitHub Pages**, a fully static export (`output: "export"`, `trailingSlash: true`, unoptimized images). Deployed by `.github/workflows/deploy.yml` on every push to `main`. Domain: https://sethsager.com
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
src/app/            routes, metadata, sitemap, robots
src/components/     reusable presentation components
src/content/        typed content: site.ts, projects.ts, connection.ts, now.ts, writing.ts
content/writing/    Markdown essays (frontmatter + body)
public/media/       project imagery
```

### Routes

`/` Home · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/about` · `/connection` · `/connect` · `/now`

`/connection` is the Connection project's detail page (see `detailHref` in `projects.ts`); `/work/connection/` is a static meta-refresh page that forwards there.

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

## Manufacturing experience

Seth has spent **over 20 years in manufacturing, supply chain, and operations**. It is an important part of his story and it **supports, but does not replace, his builder-first identity.** He is a builder and entrepreneur first; the experience explains how he thinks.

- It appears as the homepage band "Beyond the code / Built on experience." (after Selected Work, before Writing; `Band` component, Deep Atlantic) and as a section on `/about` (four areas: Manufacturing & Operations, Supply Chain & Procurement, Leadership & People, Systems & Technology). Copy lives in `src/content/experience.ts` and the homepage.
- Keep it concise, confident, and conversational. Do **not** turn the site into a résumé: no job-title lists, employer names, timelines, or credentials.
- Only the verified claim is "over 20 years in manufacturing, supply chain, and operations". **Never fabricate** company names, career milestones, metrics, or accomplishments. If Seth supplies specifics, add them deliberately.
- Avoid corporate jargon and motivational clichés. Frame experience as how it shapes what he builds, not as credentials.

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

Work in feature branches and open pull requests. **Never merge to `main` or deploy to production without Seth's explicit approval. Merging to `main` IS a production deploy**, because the workflow publishes every push. Never enable Pages, change DNS, or alter the custom domain.

## Static hosting rules (GitHub Pages)

The site must always build as a static export. Full detail is in the README ("Deployment").

- No server features: middleware, rewrites, headers, config `redirects()`, API routes, server actions, ISR, request APIs.
- Redirects are static meta-refresh pages (see `/work/[slug]` for slugs whose `detailHref` is elsewhere).
- Every dynamic route needs complete `generateStaticParams()` and `dynamicParams = false`.
- `sitemap.ts` and `robots.ts` stay `force-static`. Sitemap URLs and canonicals end in `/`.
- Images are served as-is (`images.unoptimized`). Keep files in `public/media` small and pre-sized.
- The social image is the static file `public/og-image.png`. GitHub Pages cannot serve extensionless files as images, so do not reintroduce a generated `opengraph-image` route.
- Use root-relative paths (`/media/...`). Do not add a `basePath` or a `/sethsager-web` prefix; the site is served from the custom domain root.
- Everything external uses `https`.
- Do not add server-side dependencies.
- Test the real output: `npm run build && npm run preview`.

## Commands

```bash
npm run dev        # local development
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run check      # lint + typecheck
npm run build      # static export to out/
npm run preview    # serve out/ locally (after build)
```
