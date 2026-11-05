import { photoBase, photos, type PhotoId } from "@/content/photos";

/**
 * A responsive photograph: WebP with a JPEG fallback, several widths, and
 * intrinsic dimensions so the page never shifts while it loads.
 *
 * This is a plain <img> on purpose. The site is a static export, where the
 * Next.js image optimizer does not exist, so the responsive files are
 * pre-built by scripts/make-photos.py.
 */
export function Photo({
  id,
  sizes,
  className,
  priority = false,
}: {
  id: PhotoId;
  /** The `sizes` attribute: how wide the image is shown at each breakpoint. */
  sizes: string;
  className?: string;
  /** Only for the image that is visible on first paint (the hero). */
  priority?: boolean;
}) {
  const photo = photos[id];
  const srcSet = (ext: "webp" | "jpg") =>
    photo.widths.map((w) => `${photoBase}/${id}-${w}.${ext} ${w}w`).join(", ");
  // Fallback src: the middle size.
  const fallback = photo.widths[Math.floor((photo.widths.length - 1) / 2)];

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
      <img
        className={className}
        src={`${photoBase}/${id}-${fallback}.jpg`}
        srcSet={srcSet("jpg")}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
      />
    </picture>
  );
}
