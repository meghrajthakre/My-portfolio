const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
const CACHE_TTL = 25 * 1000;
const REQUEST_TIMEOUT = 8_000;

let cache = null;

const offlineTrack = () => ({
  isPlaying: false,
  status: "offline",
  title: null,
  artist: null,
  album: null,
  albumArt: null,
  url: null,
  playedAt: null,
});

const getText = (value) => (typeof value === "string" && value.trim() ? value.trim() : null);

const getAlbumArt = (images) => {
  if (!Array.isArray(images)) return null;

  const preferredImage = [...images].reverse().find((image) => getText(image?.["#text"]));
  return getText(preferredImage?.["#text"]);
};

const normalizeTrack = (track) => {
  if (!track || typeof track !== "object") return offlineTrack();

  const isPlaying = track["@attr"]?.nowplaying === "true";
  const playedAt = isPlaying ? null : getText(track.date?.uts);

  return {
    isPlaying,
    status: isPlaying ? "now_playing" : "last_played",
    title: getText(track.name),
    artist: getText(track.artist?.["#text"]) || getText(track.artist?.name),
    album: getText(track.album?.["#text"]) || getText(track.album?.name),
    albumArt: getAlbumArt(track.image),
    url: getText(track.url),
    playedAt,
  };
};

const getCachedMusic = () => (
  cache && Date.now() - cache.savedAt < CACHE_TTL ? cache.data : null
);

export const getNowPlaying = async () => {
  const cached = getCachedMusic();
  if (cached) return cached;

  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey || !username) {
    const error = new Error("Last.fm service is not configured");
    error.status = 503;
    throw error;
  }

  try {
    const params = new URLSearchParams({
      method: "user.getrecenttracks",
      user: username,
      api_key: apiKey,
      format: "json",
      limit: "1",
    });
    const response = await fetch(`${LASTFM_API_URL}?${params}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      const error = new Error("Last.fm service is unavailable");
      error.status = response.status >= 500 ? 503 : 502;
      throw error;
    }

    const payload = await response.json();
    if (!payload || typeof payload !== "object" || payload.error || !payload.recenttracks) {
      const error = new Error("Invalid response from Last.fm");
      error.status = 502;
      throw error;
    }

    const { track } = payload.recenttracks;
    const latestTrack = Array.isArray(track) ? track[0] : track;
    const data = latestTrack ? normalizeTrack(latestTrack) : offlineTrack();

    cache = { data, savedAt: Date.now() };
    return data;
  } catch (error) {
    // Serve the most recent known track if Last.fm is temporarily unavailable.
    if (cache) return cache.data;
    if (error.name === "TimeoutError" || error.name === "AbortError") error.status = 504;
    if (error instanceof SyntaxError) error.status = 502;
    throw error;
  }
};
