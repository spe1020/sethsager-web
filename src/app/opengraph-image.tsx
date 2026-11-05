import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f9fc",
          color: "#18263b",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#234fc4", fontFamily: "sans-serif" }}>
          CURIOUS BY NATURE. BUILDER BY CHOICE.
        </div>
        <div style={{ fontSize: 88, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
          <span>There’s always</span>
          <span style={{ color: "#3268e8", fontStyle: "italic" }}>a better way.</span>
        </div>
        <div style={{ fontSize: 36, display: "flex" }}>{site.name}</div>
      </div>
    ),
    size,
  );
}
