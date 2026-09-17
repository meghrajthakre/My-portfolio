import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { getNowPlaying } from "../../../services/musicService";

const REFRESH_INTERVAL = 60_000;
const TRACK_CACHE_KEY = "now-playing:last-track";

const readCachedTrack = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(TRACK_CACHE_KEY));
    if (!cached?.title || !cached?.artist || !["now_playing", "last_played"].includes(cached.status)) return null;
    return cached;
  } catch {
    return null;
  }
};

const saveCachedTrack = (nextTrack) => {
  try {
    localStorage.setItem(TRACK_CACHE_KEY, JSON.stringify(nextTrack));
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }
};

const NowPlaying = () => {
  const [track, setTrack] = useState(readCachedTrack);
  const [isLoading, setIsLoading] = useState(() => !readCachedTrack());

  useEffect(() => {
    const controller = new AbortController();

    const loadTrack = async () => {
      try {
        const data = await getNowPlaying({ signal: controller.signal });
        const nextTrack = data.status === "offline" || !data.title || !data.artist ? null : data;
        setTrack(nextTrack);
        if (nextTrack) saveCachedTrack(nextTrack);
      } catch (error) {
        // Keep the cached track visible when the API is temporarily unavailable.
        if (error.name !== "AbortError") setTrack((currentTrack) => currentTrack ?? readCachedTrack());
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadTrack();
    const interval = window.setInterval(loadTrack, REFRESH_INTERVAL);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  if (!track && !isLoading) return null;

  if (isLoading && !track) {
    return (
      <div className="mt-4 flex items-center gap-2 text-sm leading-5 text-[var(--color-secondary-text)] sm:text-sm" role="status" aria-live="polite">
        <FaSpotify className="size-[15px] shrink-0 animate-pulse text-[#1ed760]" aria-hidden="true" />
        <span>Loading music...</span>
      </div>
    );
  }

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
