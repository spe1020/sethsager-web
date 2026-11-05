import Link from "next/link";
import { navigation, site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div>
          <p className="wordmark footer-name">{site.name}</p>
          <p className="footer-thesis">{site.thesis}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="nav-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
