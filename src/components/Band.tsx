import type { ReactNode } from "react";

/**
 * Full-width Deep Atlantic band for a single, confident statement.
 * Left: eyebrow, large headline, optional caption. Right: body and one action.
 * Pass the action as a link or button with tone="dark".
 *
 * With `media` (a <Photo>), the text sits on the left and the photograph runs
 * edge-to-edge on the right, full band height. On mobile it stacks.
 * `compact` uses a smaller headline for longer sentences.
 */
export function Band({
  id,
  eyebrow,
  title,
  caption,
  children,
  action,
  media,
  compact = false,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  caption?: string;
  children: ReactNode;
  action?: ReactNode;
  media?: ReactNode;
  compact?: boolean;
}) {
  const head = (
    <div className="band-head">
      <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {caption ? <p className="band-caption">{caption}</p> : null}
    </div>
  );
  const body = (
    <div className="band-body">
      {children}
      {action ? <div className="band-action">{action}</div> : null}
    </div>
  );
  const className = ["band", media ? "has-media" : "", compact ? "band-compact" : ""].filter(Boolean).join(" ");

  return (
    <section className={className} aria-labelledby={id}>
      {media ? (
        <div className="band-media-grid">
          <div className="band-text">
            {head}
            {body}
          </div>
          <div className="band-media">{media}</div>
        </div>
      ) : (
        <div className="shell band-inner">
          {head}
          {body}
        </div>
      )}
    </section>
  );
}
