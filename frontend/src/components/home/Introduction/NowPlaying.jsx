import { useEffect, useState } from "react";
import { FaSpotify } from "react-icons/fa";
import { getNowPlaying } from "../../../services/musicService";

const REFRESH_INTERVAL = 60_000;
const TRACK_CACHE_KEY = "now-playing:last-track";
const VALID_STATUSES = ["now_playing", "last_played"];

const readCachedTrack = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(TRACK_CACHE_KEY));
    if (!cached?.title || !cached?.artist || !VALID_STATUSES.includes(cached.status)) {
      return null;
    }
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
        const isPlayable = data.status !== "offline" && data.title && data.artist;
        const nextTrack = isPlayable ? data : null;

        setTrack(nextTrack);
        if (nextTrack) saveCachedTrack(nextTrack);
      } catch (error) {
        if (error.name !== "AbortError") {
          setTrack((currentTrack) => currentTrack ?? readCachedTrack());
        }
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
      <div
        className="mt-5 flex h-5 items-center gap-2"
        role="status"
        aria-label="Loading now playing"
      >
        <span
          className="size-[15px] shrink-0 animate-pulse rounded-full bg-[var(--color-icons-bg)]"
          aria-hidden="true"
        />
        <span
          className="h-3 w-52 max-w-[65vw] animate-pulse rounded-full bg-[var(--color-icons-bg)]"
          aria-hidden="true"
        />
      </div>
    );
  }

  const label = track.status === "now_playing" ? "Now playing" : "Last played";
  const textContent = (
    <>
      {label} — {track.title} <span aria-hidden="true">·</span> {track.artist}
    </>
  );

  return (
    <div
      className="group mt-8 flex items-center gap-2 text-sm leading-5 text-[var(--color-secondary-text)]"
      aria-live="polite"
    >
      <FaSpotify
        className="size-[16px] shrink-0 text-[#1ed760] transition-transform duration-200 group-hover:scale-110 group-focus-within:scale-110"
        aria-hidden="true"
      />
      {track.url ? (
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          className="min-w-0 truncate text-[var(--color-secondary-text)] no-underline decoration-[var(--color-text)] decoration-1 underline-offset-[3px] transition-colors duration-200 hover:text-[var(--color-text)] hover:underline focus-visible:text-[var(--color-text)] focus-visible:underline focus-visible:outline-none"
          aria-label={`${label}: ${track.title} by ${track.artist} (opens in a new tab)`}
        >
          {textContent}
        </a>
      ) : (
        <p className="truncate">{textContent}</p>
      )}
    </div>
  );
};

export default NowPlaying;