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
          background: "#f6f1e8",
          color: "#1c1915",
          padding: 80,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#6f2c12", fontFamily: "sans-serif" }}>
          BUILDER · ENTREPRENEUR · SYSTEMS THINKER
        </div>
        <div style={{ fontSize: 88, lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
          <span>Ideas are easy.</span>
          <span style={{ color: "#9a3b16", fontStyle: "italic" }}>
            Building is the interesting part.
          </span>
        </div>
        <div style={{ fontSize: 36, display: "flex" }}>{site.name}</div>
      </div>
    ),
    size,
  );
}
