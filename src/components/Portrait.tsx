import Image from "next/image";
import { site } from "@/content/site";

/**
 * Shows Seth's real portrait when `site.portrait` is set.
 * Until then it is an honest, clearly marked placeholder. Never substitute
 * a generated or stock image.
 */
export function Portrait({ priority = false }: { priority?: boolean }) {
  if (site.portrait) {
    return (
      <figure className="portrait">
        <Image
          src={site.portrait.src}
          alt={site.portrait.alt}
          width={site.portrait.width}
          height={site.portrait.height}
          sizes="(max-width: 860px) 80vw, 420px"
          priority={priority}
        />
      </figure>
    );
  }

  return (
    <figure className="portrait portrait-placeholder" aria-label="Portrait placeholder">
      <div className="portrait-frame">
        <span className="portrait-mono" aria-hidden="true">
          S
        </span>
        <figcaption>
          Portrait coming
          <span>A real photo goes here.</span>
        </figcaption>
      </div>
    </figure>
  );
}
