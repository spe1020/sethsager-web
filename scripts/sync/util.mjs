// Small, dependency-free helpers shared by the sync scripts.

/** Entities that appear in feeds. Numeric entities are handled separately. */
const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", ndash: "–", mdash: "—", hellip: "…" };

export function decodeEntities(text) {
  return String(text)
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m);
}

/** HTML to plain-text paragraphs. Links keep their text; structure becomes paragraph breaks. */
export function htmlToParagraphs(html) {
  if (!html) return [];
  const text = String(html)
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*\/\s*(p|div|h[1-6]|li|ul|ol|blockquote)\s*>/gi, "\n\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .split(/\n{2,}/)
    .map((p) => p.replace(/[ \t\r\n]+/g, " ").trim())
    .filter(Boolean);
}

export const htmlToText = (html) => htmlToParagraphs(html).join(" ");

/** Stable identity for a URL: lowercase host, no hash/query/trailing slash. */
export function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/+$/, "");
    return `${u.protocol}//${u.host.toLowerCase()}${path}`;
  } catch {
    return String(raw).trim().toLowerCase();
  }
}

/** Deterministic JSON: same data always serializes to the same bytes. */
export const stableStringify = (value) => `${JSON.stringify(value, null, 2)}\n`;

export const toIso = (value) => {
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? null : new Date(ms).toISOString().replace(/\.\d{3}Z$/, "Z");
};

export const asArray = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

/** GitHub Actions annotations when running in CI, plain text otherwise. */
const inCI = () => process.env.GITHUB_ACTIONS === "true";
export const notice = (msg) => console.log(inCI() ? `::notice::${msg}` : `note: ${msg}`);
export const warn = (title, msg) =>
  console.log(inCI() ? `::warning title=${title}::${msg}` : `WARNING [${title}]: ${msg}`);
export const fail = (title, msg) =>
  console.log(inCI() ? `::error title=${title}::${msg}` : `ERROR [${title}]: ${msg}`);
