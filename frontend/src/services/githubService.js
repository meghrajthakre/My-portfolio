const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const getGithubContributions = async (username, { signal } = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(username)}/contributions`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("GitHub activity request failed");
  }

  const data = await response.json();

  if (!Array.isArray(data.contributions)) {
    throw new Error("Invalid GitHub activity response");
  }

  return data;
};

export const getGithubBuildNumber = async (owner, repo, { signal } = {}) => {
  const response = await fetch(
    `${API_BASE_URL}/api/github/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/build-number`,
    { signal },
  );
  if (!response.ok) throw new Error("GitHub build number request failed");
  return response.json();
};
