export const site = {
  name: "Seth Sager",
  url: "https://sethsager.com",
  /** Short statement used in metadata and the footer. */
  thesis:
    "I build products, rethink systems, and explore ideas that make technology more useful and life a little more human.",
  eyebrow: "Curious by nature. Builder by choice.",
  tagline: "There’s always a better way.",
  /**
   * Seth's formal headshot. It belongs on /about. Candid photography (see
   * src/content/photos.ts) is used everywhere else. Set to null to show a placeholder.
   * Never generate or substitute a fictional image.
   */
  portrait: {
    src: "/media/seth-sager-portrait.png",
    alt: "Seth Sager smiling, wearing glasses, a dark blazer, and a blue shirt.",
    width: 400,
    height: 400,
  } as null | { src: string; alt: string; width: number; height: number },
  email: "seth@zap.cooking" as null | string,
} as const;

export type NavItem = { href: string; label: string };

/** Primary navigation. Kept to six items so the header stays uncrowded. */
export const navigation: readonly NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/connection", label: "Connection" },
  { href: "/about", label: "About" },
  { href: "/connect", label: "Connect" },
];

/** Lower-priority pages: reachable from the footer rather than the header. */
export const secondaryNavigation: readonly NavItem[] = [{ href: "/now", label: "Now" }];

export type SocialLink = { label: string; href: string; note: string };

/** Verified public profiles. */
export const socialLinks: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/spe1020",
    note: "Code for this site and other experiments.",
  },
  {
    label: "Substack",
    href: "https://zapcooking.substack.com",
    note: "Essays on building, technology, and curiosity.",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ZapCooking",
    note: "Connection episodes on video.",
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/connection/id6811601309",
    note: "Connection, the podcast.",
  },
];

export const themes = {
  building: {
    label: "Building",
    blurb: "Entrepreneurship, products, software, experimentation, open technology.",
  },
  thinking: {
    label: "Thinking",
    blurb: "Systems, manufacturing, leadership, AI, economics, and society.",
  },
  connecting: {
    label: "Connecting",
    blurb: "Human relationships, communication, communities, education, and podcasting.",
  },
} as const;

export type ThemeKey = keyof typeof themes;
