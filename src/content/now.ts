/**
 * What Seth is currently building and exploring.
 * Only statements already supported by the project pages belong here.
 * Update `updated` whenever this changes.
 */
export const now = {
  updated: "2026-11-04",
  intro:
    "A working snapshot of what has my attention. It is not a status report, and it changes.",
  sections: [
    {
      heading: "Building",
      items: [
        "Zap Cooking: an open social cooking platform with recipes, community, AI, and Bitcoin payments.",
        "Zap Books: privacy-first accounting software, currently in private beta.",
        "LoopSignal: manufacturing problem-solving software that keeps evidence, actions, and learning connected.",
        "Grateful Day: a small daily practice for gratitude and reflection.",
      ],
    },
    {
      heading: "Talking",
      items: [
        "Connection: a podcast about food, people, ideas, building, and gratitude, presented by Zap Cooking.",
      ],
    },
    {
      heading: "Thinking about",
      items: [
        "How simple a tool can be while still respecting the person using it.",
        "Where AI should help and where a person should still decide.",
        "What manufacturing floors teach software builders about systems.",
      ],
    },
  ],
} as const;
