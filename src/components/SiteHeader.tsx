"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, site } from "@/content/site";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link href="/" className="wordmark" aria-current={pathname === "/" ? "page" : undefined}>
          {site.name}
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
