const GITHUB_CONTRIBUTIONS_API = (
  process.env.GITHUB_CONTRIBUTIONS_API_URL
  || "https://github-contributions-api.jogruber.de/v4"
).replace(/\/$/, "");
const CACHE_TTL = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 10_000;

const cache = new Map();
const buildCache = new Map();

const REPO_PART_PATTERN = /^[a-z0-9._-]{1,100}$/i;

export const getGithubBuildNumber = async (req, res, next) => {
  const { owner, repo } = req.params;
  if (!REPO_PART_PATTERN.test(owner) || !REPO_PART_PATTERN.test(repo)) {
    return res.status(400).json({ success: false, message: "Invalid GitHub repository" });
  }

  const cacheKey = `${owner}/${repo}`.toLowerCase();
  const cached = buildCache.get(cacheKey);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL) {
    return res.status(200).json(cached.data);
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      },
    );

    if (!response.ok) {
      const error = new Error("GitHub repository service is unavailable");
      error.status = response.status;
      throw error;
    }

    const commits = await response.json();
    const link = response.headers.get("link") || "";
    const lastPage = link.match(/[?&]page=(\d+)>; rel="last"/);
    const data = { buildNumber: lastPage ? Number(lastPage[1]) : commits.length };

    buildCache.set(cacheKey, { data, savedAt: Date.now() });
    return res.status(200).json(data);
  } catch (error) {
    if (cached) return res.status(200).json(cached.data);
    if (error.name === "TimeoutError") error.status = 504;
    return next(error);
  }
};

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
