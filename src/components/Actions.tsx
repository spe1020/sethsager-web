import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The action system. One visual language for everything clickable that is
 * more than a plain in-text link:
 *
 *   PrimaryAction    split button: label + separate blue arrow segment
 *   SecondaryAction  outlined/ice button with an inline arrow
 *   EditorialLink    text + arrow over a fine divider
 *   ExternalLink     EditorialLink to another site (diagonal arrow, new tab)
 *
 * Navigation renders a real link (next/link, or <a> for external and mailto).
 * Actions that do something (no destination) render a real <button>.
 * Arrows are decorative; external links announce that they open a new tab.
 */

export type Tone = "light" | "dark";
export type ArrowDirection = "right" | "left" | "external";

export function Arrow({ direction = "right" }: { direction?: ArrowDirection }) {
  return (
    <svg
      className={`arrow arrow-${direction}`}
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      {direction === "external" ? (
        <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />
      ) : direction === "left" ? (
        <path d="M13 8H3M7 4L3 8l4 4" />
      ) : (
        <path d="M3 8h10M9 4l4 4-4 4" />
      )}
    </svg>
  );
}

type TargetProps = {
  children: ReactNode;
  className: string;
  external?: boolean;
} & (
  | { href: string; onClick?: undefined }
  | { href?: undefined; onClick: () => void }
);

/** Renders the right element for the job: link, external link, or button. */
function Target({ href, onClick, external, className, children }: TargetProps) {
  if (href === undefined) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

type ActionProps = {
  children: ReactNode;
  tone?: Tone;
  external?: boolean;
  className?: string;
} & (
  | { href: string; onClick?: undefined }
  | { href?: undefined; onClick: () => void }
);

const cx = (...parts: Array<string | false | undefined>) => parts.filter(Boolean).join(" ");

export function PrimaryAction({ children, tone = "light", external, className, ...target }: ActionProps) {
  return (
    <Target {...target} external={external} className={cx("action action-primary", `tone-${tone}`, className)}>
      <span className="action-label">{children}</span>
      <span className="action-arrow">
        <Arrow direction={external ? "external" : "right"} />
      </span>
    </Target>
  );
}

export function SecondaryAction({ children, tone = "light", external, className, ...target }: ActionProps) {
  return (
    <Target {...target} external={external} className={cx("action action-secondary", `tone-${tone}`, className)}>
      <span className="action-label">{children}</span>
      <Arrow direction={external ? "external" : "right"} />
    </Target>
  );
}

type EditorialLinkProps = ActionProps & {
  /** "left" is for back-navigation. */
  direction?: "right" | "left";
  /** Stretch the click target over the nearest positioned card. */
  stretch?: boolean;
};

export function EditorialLink({
  children,
  tone = "light",
  external,
  direction = "right",
  stretch,
  className,
  ...target
}: EditorialLinkProps) {
  const arrow: ArrowDirection = external ? "external" : direction;
  return (
    <Target
      {...target}
      external={external}
      className={cx("editorial-link", `tone-${tone}`, direction === "left" && "is-back", stretch && "is-stretched", className)}
    >
      {direction === "left" && !external ? <Arrow direction="left" /> : null}
      <span className="editorial-link-text">{children}</span>
      {arrow !== "left" ? <Arrow direction={arrow} /> : null}
    </Target>
  );
}

/** Editorial link to another site. Always a new tab, always the diagonal arrow. */
export function ExternalLink({
  href,
  children,
  tone,
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <EditorialLink external href={href} tone={tone} className={className}>
      {children}
    </EditorialLink>
  );
}
