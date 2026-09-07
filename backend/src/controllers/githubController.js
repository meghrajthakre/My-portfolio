const GITHUB_CONTRIBUTIONS_API = (
  process.env.GITHUB_CONTRIBUTIONS_API_URL
  || "https://github-contributions-api.jogruber.de/v4"
).replace(/\/$/, "");
const CACHE_TTL = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 10_000;

const cache = new Map();
const buildCache = new Map();

const REPO_PART_PATTERN = /^[a-z0-9._-]{1,100}$/i;

const getGithubHeaders = (includeToken = true) => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "mt-portfolio-backend",
  ...(includeToken && process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
});

const fetchLatestCommit = (owner, repo, includeToken = true) => fetch(
  `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=1`,
  {
    headers: getGithubHeaders(includeToken),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  },
);

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

  const renderRepo = process.env.RENDER_GIT_REPO_SLUG?.toLowerCase();
  const renderCommit = process.env.RENDER_GIT_COMMIT;

  // Render already knows which Git commit is currently deployed. Prefer that
  // value so the footer does not consume GitHub API quota on production.
  if (
    (!renderRepo || renderRepo === cacheKey)
    && typeof renderCommit === "string"
    && /^[a-f0-9]{7,40}$/i.test(renderCommit)
  ) {
    const data = {
      buildNumber: renderCommit.slice(0, 7),
      buildDate: process.env.BUILD_DATE || null,
    };
    buildCache.set(cacheKey, { data, savedAt: Date.now() });
    return res.status(200).json(data);
  }

  try {
    let response = await fetchLatestCommit(owner, repo);

    // Public repo data should still work if a configured token is stale or
    // does not have the correct repository permission.
    if (process.env.GITHUB_TOKEN && (response.status === 401 || response.status === 403)) {
      response = await fetchLatestCommit(owner, repo, false);
    }

    if (!response.ok) {
      const isRateLimited = response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0";
      const error = new Error(isRateLimited ? "GitHub API rate limit reached" : "GitHub repository service is unavailable");
      error.status = isRateLimited ? 503 : response.status;
      throw error;
    }

    const commits = await response.json();
    const latestCommitSha = commits[0]?.sha;

    if (typeof latestCommitSha !== "string") {
      const error = new Error("Invalid GitHub commits response");
      error.status = 502;
      throw error;
    }

    const commitDate = commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date;
    const data = {
      buildNumber: latestCommitSha.slice(0, 7),
      buildDate: commitDate ? commitDate.slice(0, 10) : null,
    };

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
