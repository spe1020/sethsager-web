import manifest from "./photos.manifest.json";

/**
 * Real photographs of Seth. Files are built by scripts/make-photos.py (which
 * also removes all metadata) and live in public/media/photos. The manifest it
 * writes supplies sizes; the alt text is written here by hand.
 *
 * Use real, candid photography over generic visuals. Never substitute stock
 * or generated images. Each photo has ONE intentional place on the site:
 *
 *   hero-woods             homepage hero
 *   experience-ferris      homepage "Built on experience" band
 *   intro-grass            homepage personal introduction
 *   speaking-nostr-valley  /speaking
 *   connection-studio      /connection
 *
 * (The formal headshot, site.portrait, belongs on /about.)
 */
export type PhotoId = keyof typeof manifest;

export type Photo = {
  id: PhotoId;
  alt: string;
  /** Available widths, ascending. */
  widths: number[];
  /** Intrinsic size of the largest file; sets the aspect ratio. */
  width: number;
  height: number;
};

const alt: Record<PhotoId, string> = {
  "hero-woods":
    "Seth smiling in sunglasses and a light blue t-shirt, with sunlit woods and a ridge of hills behind him.",
  "experience-ferris":
    "Seth smiling in a black cap and sunglasses from a ferris wheel car, with a hillside town and a fairground far below.",
  "intro-grass":
    "Seth smiling in a cap, sunglasses, and a yellow graphic t-shirt, photographed from above on a lawn.",
  "speaking-nostr-valley":
    "Seth speaking into a microphone in a Nostr Valley t-shirt, in front of a screen that reads “Software is not our moat” beside the Zap Cooking logo.",
  "connection-studio":
    "Seth in a plaid shirt at a podcast microphone in a home studio, with shelves, a guitar, and a Nostr sticker behind him.",
};

export const photos = Object.fromEntries(
  (Object.keys(manifest) as PhotoId[]).map((id) => [id, { id, alt: alt[id], ...manifest[id] }]),
) as Record<PhotoId, Photo>;

export const photoBase = "/media/photos";
