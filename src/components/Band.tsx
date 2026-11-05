import type { ReactNode } from "react";

/**
 * Full-width Deep Atlantic band for a single, confident statement.
 * Left: eyebrow, large headline, optional caption. Right: body and one action.
 * Pass the action as an EditorialLink with tone="dark".
 */
export function Band({
  id,
  eyebrow,
  title,
  caption,
  children,
  action,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  caption?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="band" aria-labelledby={id}>
      <div className="shell band-inner">
        <div className="band-head">
          <p className="eyebrow eyebrow-on-dark">{eyebrow}</p>
          <h2 id={id}>{title}</h2>
          {caption ? <p className="band-caption">{caption}</p> : null}
        </div>
        <div className="band-body">
          {children}
          {action ? <div className="band-action">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}
