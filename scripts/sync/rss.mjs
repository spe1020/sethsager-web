import { XMLParser } from "fast-xml-parser";
import { asArray } from "./util.mjs";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseTagValue: false, // keep durations like 00:35:07 and numeric-looking guids as strings
  trimValues: true,
});

const text = (v) => (v && typeof v === "object" ? String(v["#text"] ?? "") : v === undefined || v === null ? "" : String(v));

/**
 * Parse RSS 2.0 or Atom into a uniform shape and validate it.
 * Throws if the document is not a usable feed (for example an HTML error page).
 */
export function parseFeed(xml) {
  let doc;
  try {
    doc = parser.parse(xml);
  } catch (err) {
    throw new Error(`not valid XML: ${err.message}`);
  }
  if (doc.rss?.channel) {
    const ch = doc.rss.channel;
    const items = asArray(ch.item).map((i) => ({
      title: text(i.title),
      link: text(i.link),
      guid: text(i.guid),
      published: text(i.pubDate),
      description: text(i.description),
      duration: text(i["itunes:duration"]),
    }));
    return { kind: "rss", title: text(ch.title), items };
  }
  if (doc.feed) {
    const items = asArray(doc.feed.entry).map((e) => ({
      title: text(e.title),
      link: asArray(e.link).map((l) => l["@_href"]).find(Boolean) ?? "",
      guid: text(e.id),
      published: text(e.published),
      videoId: text(e["yt:videoId"]),
    }));
    return { kind: "atom", title: text(doc.feed.title), items };
  }
  throw new Error("not an RSS or Atom feed");
}
