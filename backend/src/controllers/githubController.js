const GITHUB_CONTRIBUTIONS_API = (
  process.env.GITHUB_CONTRIBUTIONS_API_URL
  || "https://github-contributions-api.jogruber.de/v4"
).replace(/\/$/, "");
const CACHE_TTL = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 10_000;

const cache = new Map();

export const getGithubContributions = async (req, res, next) => {
  const username = req.params.username;
  const cached = cache.get(username);

  if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    const response = await fetch(
      `${GITHUB_CONTRIBUTIONS_API}/${encodeURIComponent(username)}?y=last`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT) },
    );

    if (!response.ok) {
      const error = new Error("GitHub contributions service is unavailable");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    if (!Array.isArray(data.contributions)) {
      const error = new Error("Invalid response from GitHub contributions service");
      error.status = 502;
      throw error;
    }

    cache.set(username, { data, savedAt: Date.now() });
    return res.status(200).json(data);
  } catch (error) {
    // Keep showing the last successful response if the upstream service is down.
    if (cached) return res.status(200).json(cached.data);

    if (error.name === "TimeoutError") error.status = 504;
    return next(error);
  }
};
