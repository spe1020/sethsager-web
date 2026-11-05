/**
 * Single source for portfolio projects.
 * The homepage, work index, and project routes all read this module.
 * `websiteUrl` and `links` leave the site. `detailHref` stays on it.
 */

export type ProjectStatus = "active" | "private-beta" | "annual-event";

export type ProjectProminence = "feature" | "secondary" | "editorial";

export type ExternalLinkKind = "youtube" | "apple-podcasts" | "other";

export type ExternalLink = {
  label: string;
  href: string;
  kind: ExternalLinkKind;
};

export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "screenshot" | "artwork";
  caption?: string;
};

export type ProjectLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseStudySection = {
  heading: string;
  paragraphs: string[];
};

export type Project = {
  name: string;
  slug: string;
  description: string;
  category: string;
  /** Seth's role, where it is not simply "built it". */
  role?: string;
  /** Label for the internal link. Defaults to "The story behind it". */
  detailLabel?: string;
  coverImage?: ProjectImage;
  logo?: ProjectLogo;
  websiteUrl?: string;
  links: ExternalLink[];
  featured: boolean;
  displayOrder: number;
  prominence: ProjectProminence;
  status: ProjectStatus;
  /** Internal page. Distinct from websiteUrl and links. */
  detailHref: string;
  /** Another project in this same list, when one presents another. */
  presentedBySlug?: string;
  caseStudy?: {
    sections: CaseStudySection[];
  };
};

export const projectStatusLabel: Record<ProjectStatus, string> = {
  active: "Active",
  "private-beta": "Private beta",
  "annual-event": "Annual event",
};

export const projects: Project[] = [
  {
    name: "Zap Cooking",
    slug: "zap-cooking",
    description:
      "An open social cooking platform combining food, community, AI, and instant Bitcoin payments.",
    category: "Consumer software / Open technology",
    coverImage: {
      src: "/media/zap-cooking-cover.jpg",
      alt: "Zap Cooking homepage with the line Food. Friends. Freedom. and the headline Bring your favorites. Find new ones.",
      width: 1440,
      height: 1100,
      kind: "screenshot",
      caption: "Public homepage.",
    },
    logo: {
      src: "/media/zap-cooking-mark.svg",
      alt: "Zap Cooking mark",
      width: 382,
      height: 382,
    },
    websiteUrl: "https://zap.cooking",
    links: [],
    featured: true,
    displayOrder: 1,
    prominence: "feature",
    status: "active",
    detailHref: "/work/zap-cooking",
    caseStudy: {
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "Zap Cooking is an open social cooking platform combining food, community, AI, and instant Bitcoin payments.",
            "The public site invites someone to find a recipe, save the ones they love, and share something from their own kitchen. A cook can be tipped directly, and that tip is optional.",
          ],
        },
        {
          heading: "What the public product holds",
          paragraphs: [
            "Sous Chef, described on the site, turns a recipe link into a recipe you can review before saving or sharing it. The homepage also makes room for browsing what other people have cooked and written.",
          ],
        },
      ],
    },
  },
  {
    name: "Zap Books",
    slug: "zap-books",
    description:
      "Privacy-first accounting software exploring AI assistance, financial independence, and user ownership.",
    category: "Financial software / AI",
    coverImage: {
      src: "/media/zap-books-cover.jpg",
      alt: "Zap Books homepage with the headline Less bookkeeping. More control. beside a sample expense list.",
      width: 1440,
      height: 1200,
      kind: "screenshot",
      caption:
        "Public homepage. The site labels the expense list as a fictional illustration.",
    },
    logo: {
      src: "/media/zap-books-mark.svg",
      alt: "Zap Books mark",
      width: 120,
      height: 120,
    },
    websiteUrl: "https://zapbooks.io",
    links: [],
    featured: true,
    displayOrder: 2,
    prominence: "feature",
    status: "private-beta",
    detailHref: "/work/zap-books",
    caseStudy: {
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "Zap Books is privacy-first accounting software exploring AI assistance, financial independence, and user ownership.",
            "The public site describes expenses kept with their receipts, a signed history of each change, and AI help that a person approves before an entry reaches the books.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The hosted service is in private beta and is not open for general sign-up. The homepage says its demo uses fictional businesses and runs in the browser. Figures in that sample, including the illustrated expenses, are not customer results.",
            "The aim is a simpler set of books that the owner can still understand and stand behind: help where it is useful, a person at the point of approval, and a record that stays theirs.",
          ],
        },
      ],
    },
  },
  {
    name: "LoopSignal",
    slug: "loopsignal",
    description:
      "Manufacturing problem-solving software that keeps problems, evidence, countermeasures, verification, and learning connected.",
    category: "Manufacturing / Operations / Software",
    coverImage: {
      src: "/media/loopsignal-cover.jpg",
      alt: "LoopSignal homepage with the headline Turn daily problems into improvements that last. beside an example investigation.",
      width: 1440,
      height: 1100,
      kind: "screenshot",
      caption:
        "Public homepage. The investigation panel is labeled a fictional example.",
    },
    logo: {
      src: "/media/loopsignal-mark.svg",
      alt: "LoopSignal mark",
      width: 32,
      height: 32,
    },
    websiteUrl: "https://www.loopsignal.co",
    links: [],
    featured: true,
    displayOrder: 3,
    prominence: "secondary",
    status: "active",
    detailHref: "/work/loopsignal",
    caseStudy: {
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "LoopSignal is manufacturing problem-solving software that keeps problems, evidence, countermeasures, verification, and learning connected.",
            "The public site describes a path from “something’s wrong” to a result a team can verify, and a lesson they can use again. The problem, the evidence, and the next action stay in one record.",
          ],
        },
        {
          heading: "Where it stands",
          paragraphs: [
            "The public example uses fictional records saved in the browser. The site describes company accounts, shared storage, and subscriptions as a later milestone. Numbers shown in the example investigation are part of that fiction, not a reported plant result.",
          ],
        },
      ],
    },
  },
  {
    name: "Grateful Day",
    slug: "grateful-day",
    description:
      "A daily gratitude and reflection experience featuring a calendar, thoughtful wisdom, affirmations, and reflection.",
    category: "Personal growth / Mindfulness",
    coverImage: {
      src: "/media/grateful-day-cover.jpg",
      alt: "Grateful Day daily view with a calendar, a wisdom note, an affirmation, and a gratitude prompt.",
      width: 1440,
      height: 1100,
      kind: "screenshot",
      caption: "Public daily view.",
    },
    logo: {
      src: "/media/grateful-day-mark.png",
      alt: "Grateful Day mark",
      width: 180,
      height: 180,
    },
    websiteUrl: "https://gratefulday.space",
    links: [],
    featured: true,
    displayOrder: 4,
    prominence: "secondary",
    status: "active",
    detailHref: "/work/grateful-day",
    caseStudy: {
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "Grateful Day is a daily gratitude and reflection experience featuring a calendar, thoughtful wisdom, affirmations, and reflection.",
            "A visit opens on the day itself. The public product pairs that day with a short piece of wisdom, an affirmation, and a prompt to notice something you are grateful for.",
          ],
        },
        {
          heading: "How it works",
          paragraphs: [
            "Grateful Day is a small daily practice, kept simple on purpose. The person using it decides what the day means. The software holds the calendar and the prompt.",
          ],
        },
      ],
    },
  },
  {
    name: "Nostr Valley",
    slug: "nostr-valley",
    description:
      "An annual gathering in State College, Pennsylvania, bringing together people interested in Nostr, Bitcoin, and the open internet.",
    category: "Community / Events / Open Technology",
    role: "Co-founder",
    coverImage: {
      src: "/media/nostr-valley-cover.jpg",
      alt: "Nostr Valley logo: a mountain lion above a purple ostrich in a mountain valley, inside a circular badge reading Nostr Valley.",
      width: 1200,
      height: 750,
      kind: "artwork",
      caption: "The Nostr Valley logo, from nostrvalley.com.",
    },
    websiteUrl: "https://nostrvalley.com",
    links: [],
    featured: true,
    displayOrder: 5,
    prominence: "secondary",
    status: "annual-event",
    detailHref: "/work/nostr-valley",
    caseStudy: {
      sections: [
        {
          heading: "What it is",
          paragraphs: [
            "Nostr Valley is an annual gathering in State College, Pennsylvania, for people interested in Nostr, Bitcoin, and the open internet. It is a community event, not a software product.",
            "I co-founded it. It brings together builders, creators, and curious people around Nostr, Bitcoin, and the open internet.",
          ],
        },
        {
          heading: "Nostr Valley III",
          paragraphs: [
            "The third annual gathering took place on October 17, 2026, from noon to 4 PM at Happy Valley Brewing Company in State College.",
            "The day was a lineup of short talks followed by a closing panel on the state of Nostr culture. I gave a talk, “Nobody Joins a Protocol — What We Learned Building Zap Cooking,” and joined that panel. Details and updates are on the event website.",
          ],
        },
      ],
    },
  },
  {
    name: "Connection",
    slug: "connection",
    description:
      "A podcast exploring building, creativity, technology, community, relationships, and the human experience.",
    category: "Media / Podcast",
    coverImage: {
      src: "/media/connection-artwork.jpg",
      alt: "Connection podcast artwork. An orange network surrounds a lightning bolt, with the words food, people, ideas, building, and gratitude. The artwork says presented by Zap Cooking.",
      width: 1200,
      height: 1200,
      kind: "artwork",
      caption: "Show artwork.",
    },
    links: [
      {
        label: "YouTube",
        href: "https://www.youtube.com/@ZapCooking",
        kind: "youtube",
      },
      {
        label: "Apple Podcasts",
        href: "https://podcasts.apple.com/us/podcast/connection/id6811601309",
        kind: "apple-podcasts",
      },
    ],
    featured: true,
    displayOrder: 6,
    prominence: "editorial",
    status: "active",
    detailHref: "/connection",
    detailLabel: "About the show",
    presentedBySlug: "zap-cooking",
  },
];

function assertProjects(list: Project[]) {
  const slugs = new Set<string>();
  const orders = new Set<number>();
  const details = new Set<string>();

  for (const project of list) {
    if (!project.name.trim() || !project.description.trim() || !project.category.trim()) {
      throw new Error(`Project ${project.slug} is missing name, description, or category.`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      throw new Error(`Slug ${project.slug} must be lowercase kebab-case.`);
    }
    if (slugs.has(project.slug)) {
      throw new Error(`Duplicate slug: ${project.slug}`);
    }
    slugs.add(project.slug);
    if (orders.has(project.displayOrder)) {
      throw new Error(`Duplicate display order: ${project.displayOrder}`);
    }
    orders.add(project.displayOrder);
    if (!project.detailHref.startsWith("/")) {
      throw new Error(`${project.slug} detailHref must be an internal path.`);
    }
    if (details.has(project.detailHref)) {
      throw new Error(`Duplicate detailHref: ${project.detailHref}`);
    }
    details.add(project.detailHref);
    if (project.websiteUrl && !project.websiteUrl.startsWith("https://")) {
      throw new Error(`${project.slug} websiteUrl must be https.`);
    }
    if (project.websiteUrl && project.links.some((link) => link.href === project.websiteUrl)) {
      throw new Error(`${project.slug} repeats its website inside secondary links.`);
    }
    for (const link of project.links) {
      if (!link.href.startsWith("https://")) {
        throw new Error(`${project.slug} link ${link.label} must be https.`);
      }
    }
  }

  for (const project of list) {
    if (!project.presentedBySlug) continue;
    if (!slugs.has(project.presentedBySlug) || project.presentedBySlug === project.slug) {
      throw new Error(`${project.slug} presentedBySlug must reference a different project.`);
    }
  }
}

assertProjects(projects);

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function projectsByProminence(prominence: ProjectProminence): Project[] {
  return getFeaturedProjects().filter((project) => project.prominence === prominence);
}
