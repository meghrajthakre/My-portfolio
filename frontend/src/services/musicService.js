const API_BASE_URL = (import.meta.env.VITE_API_URL).replace(/\/$/, "");

export const getNowPlaying = async ({ signal } = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/music/now-playing`, { signal });
  if (!response.ok) throw new Error("Music status request failed");

  const data = await response.json();
  if (
    !data
    || typeof data !== "object"
    || !["now_playing", "last_played", "offline"].includes(data.status)
    || typeof data.isPlaying !== "boolean"
  ) {
    throw new Error("Invalid music status response");
  }

  return data;
};
