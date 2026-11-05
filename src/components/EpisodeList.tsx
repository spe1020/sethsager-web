import { ExternalLink } from "@/components/Actions";
import { PrivacyVideo } from "@/components/PrivacyVideo";
import {
  formatDuration,
  formatEpisodeDate,
  titlesDiffer,
  youtubeWatchUrl,
  type ConnectionEpisode,
} from "@/content/connection";

export function EpisodeList({
  episodes,
  showVideo,
  emptyLabel,
}: {
  episodes: ConnectionEpisode[];
  showVideo: boolean;
  emptyLabel: string;
}) {
  if (episodes.length === 0) {
    return (
      <p className="placeholder" role="status">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ol className="episode-list">
      {episodes.map((episode) => {
        const videoTitle = episode.youtubeTitle ?? episode.title;
        const showTitleNote =
          episode.youtubeTitle !== undefined && titlesDiffer(episode.title, episode.youtubeTitle);

        return (
          <li key={episode.guid}>
            <article className="episode">
              <h3>{episode.title}</h3>
              <p className="episode-meta">
                <time dateTime={episode.publishedAt}>{formatEpisodeDate(episode.publishedAt)}</time>
                <span aria-hidden="true"> · </span>
                <span>{formatDuration(episode.duration)}</span>
              </p>
              <p>{episode.summary}</p>
              <ul className="outbound-links">
                <li>
                  <ExternalLink href={episode.appleUrl}>Apple Podcasts</ExternalLink>
                </li>
                {episode.youtubeId ? (
                  <li>
                    <ExternalLink href={youtubeWatchUrl(episode.youtubeId)}>YouTube</ExternalLink>
                  </li>
                ) : null}
              </ul>
              {showTitleNote ? (
                <p className="source-note">The YouTube upload is titled “{episode.youtubeTitle}”.</p>
              ) : null}
              {showVideo && episode.youtubeId ? (
                <PrivacyVideo videoId={episode.youtubeId} title={videoTitle} />
              ) : null}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
