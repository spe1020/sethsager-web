import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "text" | "pill" | "pill-on-dark";
};

export function ExternalLink({ href, children, variant = "text" }: ExternalLinkProps) {
  return (
    <a
      className={`external-link external-link-${variant}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
      <svg className="external-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path
          d="M6.2 3.4H3.6v9h9V9.8M8.4 3.4h4.2V7.6M12.4 3.6 7.2 8.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
