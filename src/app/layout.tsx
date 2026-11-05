import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { site, socialLinks } from "@/content/site";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const sans = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s · ${site.name}`,
  },
  description: site.thesis,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.name,
    description: site.thesis,
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "@id": `${site.url}/#person`,
                name: site.name,
                url: site.url,
                description: site.thesis,
                sameAs: socialLinks.map((link) => link.href),
                ...(site.portrait ? { image: `${site.url}${site.portrait.src}` } : {}),
              },
              {
                "@type": "WebSite",
                "@id": `${site.url}/#website`,
                url: site.url,
                name: site.name,
                publisher: { "@id": `${site.url}/#person` },
              },
            ],
          }}
        />
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
