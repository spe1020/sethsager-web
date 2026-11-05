"use client";

import { useState } from "react";

type PrivacyVideoProps = {
  videoId: string;
  title: string;
};

export function PrivacyVideo({ videoId, title }: PrivacyVideoProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button type="button" className="video-consent" onClick={() => setLoaded(true)}>
        <span className="video-consent-kicker">Video</span>
        <span className="video-consent-title">Play “{title}”</span>
        <span className="video-consent-note">
          Loads from YouTube only after you choose. Uses the privacy-enhanced player.
        </span>
      </button>
    );
  }

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&autoplay=1`;

  return (
    <div className="video-frame">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
