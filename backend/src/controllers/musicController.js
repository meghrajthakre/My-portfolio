import { getNowPlaying } from "../services/lastfmService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNowPlayingTrack = asyncHandler(async (req, res) => {
  const track = await getNowPlaying();
  res.set("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  res.status(200).json(track);
});
