import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { getNowPlaying } from "../../../services/musicService";

const REFRESH_INTERVAL = 30_000;

const NowPlaying = () => {
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadTrack = async () => {
      try {
        const data = await getNowPlaying({ signal: controller.signal });
        setTrack(data.status === "offline" || !data.title || !data.artist ? null : data);
      } catch (error) {
        if (error.name !== "AbortError") setTrack(null);
      }
    };

    loadTrack();
    const interval = window.setInterval(loadTrack, REFRESH_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  if (!track) return null;

  const label = track.status === "now_playing" ? "Now playing" : "Last played";
  const content = <>{label} — {track.title} <span aria-hidden="true">·</span> {track.artist}</>;

  return (
    <div className="mt-4 flex items-center gap-2 text-sm leading-5 text-[var(--color-secondary-text)] sm:text-sm" aria-live="polite">
      <FaSpotify className="size-[15px] shrink-0 text-[#1ed760]" aria-hidden="true" />
      {track.url ? (
        <a href={track.url} target="_blank" rel="noreferrer" className="truncate hover:text-[var(--color-text)]" aria-label={`${label}: ${track.title} by ${track.artist}`}>
          {content}
        </a>
      ) : (
        <p className="truncate">{content}</p>
      )}
    </div>
  );
};

export default NowPlaying;
