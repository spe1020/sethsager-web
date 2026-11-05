"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Arrow } from "@/components/Actions";
import { navigation, site } from "@/content/site";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  // The menu is open for one specific page. Navigating changes the pathname,
  // which closes it without an effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFor(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link href="/" className="wordmark" aria-current={pathname === "/" ? "page" : undefined}>
          {site.name}
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpenFor(open ? null : pathname)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span className="nav-toggle-icon" aria-hidden="true" />
        </button>
        <nav id={menuId} className="primary-nav" aria-label="Primary" data-open={open}>
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <Arrow direction="right" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <noscript>
        {/* Without JavaScript the menu cannot toggle, so keep it open. */}
        <style>{`.nav-toggle{display:none!important}.primary-nav{display:block!important}`}</style>
      </noscript>
    </header>
  );
}
