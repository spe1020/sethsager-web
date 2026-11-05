import Link from "next/link";
import { ExternalLink } from "@/components/Actions";
import { navigation, site, socialLinks } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div>
          <p className="wordmark footer-name">{site.name}</p>
          <p className="footer-thesis">{site.thesis}</p>
        </div>
        <div className="footer-nav">
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
          <ul className="outbound-links footer-social" aria-label="Elsewhere">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <ExternalLink href={link.href}>{link.label}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
