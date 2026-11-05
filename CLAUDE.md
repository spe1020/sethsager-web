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
- Authentic imagery only: real photographs of real experiences

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
public/media/       project imagery; public/media/photos/ holds the personal photography
```

### Routes

`/` Home · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/speaking` · `/about` · `/connection` · `/connect` · `/now`

Primary navigation is six items (Work, Writing, Speaking, Connection, About, Connect) so the header stays uncrowded. Lower-priority pages such as `/now` live in the footer (`secondaryNavigation` in `site.ts`).

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

## Photography and personal visuals

The site should feel personal and authentic, not like a corporate portfolio. **Real experiences and real photography take priority over generic visuals.** Never use stock photos, and never use AI-generated or altered images of Seth.

- **The formal headshot belongs on `/about`** (`site.portrait`). It is not used on the homepage.
- **Candid personal photography is used throughout the site**, each photo in one intentional place so it never feels like a gallery. The map is in `src/content/photos.ts`:

  | Photo | Where | Why |
  | --- | --- | --- |
  | `hero-woods` | Homepage hero | The most natural, candid image; the blue shirt echoes the palette |
  | `experience-ferris` | Homepage "Built on experience" band, edge-to-edge | Steel, structure, and a view from above |
  | `intro-grass` | Homepage "Curious first, then useful." | Relaxed and playful, for the personal introduction |
  | `speaking-nostr-valley` | `/speaking`, featured engagement | Seth presenting at Nostr Valley |
  | `connection-studio` | `/connection`, beside the show artwork | Makes the podcast feel personal |

- **Treatment:** natural proportions, no filters or effects, thoughtful crops, flat offset blue accents (no blur or glow), always meaningful alt text written in `photos.ts`.
- **Pipeline:** originals live outside the repo and are never modified. `python3 scripts/make-photos.py` applies EXIF rotation and the documented crops, **strips all metadata (several originals contain GPS coordinates)**, and writes responsive WebP + JPEG sets to `public/media/photos/` plus `src/content/photos.manifest.json`. Render photos with `<Photo id="…" sizes="…" />`, which sets intrinsic dimensions (no layout shift) and lazy-loads everything except the hero.
- **Other people:** crops are made in the file, not with CSS, so people who are not Seth (for example the other riders in the ferris-wheel photo) are never in a published image. Do the same for any new photo.
- The Connection image is a screenshot (898px wide); do not display it larger than that.
- Do not add more photos casually. Each new one needs its own place and reason.

## Speaking

`/speaking` is a dedicated section: the primary visual is the Nostr Valley photo, with a featured engagement, four conversation topics, and an inquiry band that opens `mailto:` with the subject "Speaking Inquiry — Seth Sager".

- Seth is positioned as a builder, entrepreneur, and speaker with real-world experience, **not** a professional motivational speaker. Keep it approachable and conversational.
- The topics are **conversation starters, not a record of past talks.** Do not invent engagements, audience sizes, testimonials, or credentials.
- The one featured engagement is Nostr Valley (co-founder and speaker; talk: "Nobody Joins a Protocol — What We Learned Building Zap Cooking"). Add others only when Seth supplies them.
- Contact uses the email in `site.email`. The Connect page has a small Speaking link.

**The personal brand remains builder-first, approachable, and grounded.** Photography and speaking support that story; they do not turn the site into a speaker bureau or portfolio.

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

Work in feature branches and open pull requests. **Never merge to `main` or deploy to production without Seth's explicit approval.**

## Commands

```bash
npm run dev        # local development
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run check      # lint + typecheck
npm run build      # production build
```
