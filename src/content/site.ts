export const site = {
  name: "Seth Sager",
  url: "https://sethsager.com",
  /** Short statement used in metadata and the footer. */
  thesis:
    "I build products, improve systems, and explore how technology can make life simpler, more useful, and more human.",
  tagline: "Ideas are easy. Building is the interesting part.",
  /**
   * Real portrait of Seth. Leave null until a photo is added to /public/media.
   * Never generate or substitute a fictional image.
   */
  portrait: null as null | { src: string; alt: string; width: number; height: number },
  email: "seth@zap.cooking" as null | string,
} as const;

export type NavItem = { href: string; label: string };

export const navigation: readonly NavItem[] = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/connection", label: "Connection" },
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/connect", label: "Connect" },
];

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
