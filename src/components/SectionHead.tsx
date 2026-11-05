import type { ReactNode } from "react";

export function SectionHead({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="section-head section-head-stacked">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id}>{title}</h2>
      {children ? <p className="section-sub">{children}</p> : null}
    </div>
  );
}
