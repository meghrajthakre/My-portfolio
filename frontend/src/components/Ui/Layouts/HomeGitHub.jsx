import React, { useEffect, useMemo, useRef, useState } from "react";
import ActivityCalendar from "react-activity-calendar";
import GitHubActivitySkeleton from "../../Loader/GitHubActivitySkeleton";
import { getGithubContributions } from "../../../services/githubService";

const USERNAME = "meghrajthakre";
const CACHE_KEY = `github-activity:${USERNAME}:last`;
const CACHE_TTL = 30 * 60 * 1000;
const contributionColors = [
  "var(--github-level-0)",
  "var(--github-level-1)",
  "var(--github-level-2)",
  "var(--github-level-3)",
  "var(--github-level-4)",
];

const readCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!cached?.data?.contributions?.length) return null;
    return cached;
  } catch {
    return null;
  }
};

const formatDate = (value) => new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Kolkata",
}).format(new Date(`${value}T12:00:00`)).replaceAll("/", ".");

const HomeGitHub = () => {
  const cached = useMemo(readCache, []);
  const [githubData, setGithubData] = useState(cached?.data ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);
  const [hoveredContribution, setHoveredContribution] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return undefined;

    const controller = new AbortController();
    const fetchContributions = async () => {
      try {
        const data = await getGithubContributions(USERNAME, { signal: controller.signal });

        setGithubData(data);
        setError(false);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }));
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchContributions();
    return () => controller.abort();
  }, [cached]);

  if (loading && !githubData) return <GitHubActivitySkeleton section />;

  const contributions = githubData?.contributions ?? [];
  const totalContributions = githubData?.total?.lastYear
    ?? contributions.reduce((sum, day) => sum + day.count, 0);
  const firstDate = contributions[0]?.date;
  const lastDate = contributions.at(-1)?.date;

  return (
    <section className="w-full py-4 text-[var(--color-text)]">
      <div className="gap-0.5 md:text-left">
        <h3 className="text-base md:text-lg">Featured</h3>
        <h2 className="mb-1 text-xl">GitHub Activity</h2>
      </div>

      {error && !githubData ? (
        <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 text-center">
          <p className="text-sm text-[var(--color-secondary-text)]">GitHub activity is temporarily unavailable.</p>
          <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold underline underline-offset-4">View GitHub profile</a>
        </div>
      ) : (
        <div className="github-calendar github-calendar-scroll mt-5 w-full max-w-full overflow-x-auto rounded-xl border border-dashed border-[var(--color-border)] p-6 text-[var(--github-calendar-muted)] sm:p-7 md:overflow-x-hidden md:py-9">
          <div>
            <div ref={calendarRef} className="relative min-w-[636px]">
              <ActivityCalendar
                data={contributions}
                blockSize={10}
                blockMargin={2}
                blockRadius={2}
                fontSize={14}
                hideTotalCount
                hideColorLegend
                maxLevel={4}
                theme={{ light: contributionColors, dark: contributionColors }}
                renderBlock={(block, activity) => React.cloneElement(block, {
                  onMouseEnter: (event) => {
                    const bounds = calendarRef.current?.getBoundingClientRect();
                    if (!bounds) return;
                    setHoveredContribution({
                      activity,
                      x: event.clientX - bounds.left,
                      y: event.clientY - bounds.top,
                    });
                  },
                  onMouseLeave: () => setHoveredContribution(null),
                })}
              />

              {hoveredContribution && (
                <div role="tooltip" className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-[var(--color-text)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] shadow-xl" style={{ left: hoveredContribution.x, top: hoveredContribution.y }}>
                  {hoveredContribution.activity.count} {hoveredContribution.activity.count === 1 ? "contribution" : "contributions"} on {formatDate(hoveredContribution.activity.date)}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                <span>
                  {totalContributions.toLocaleString("en-IN")} contributions{firstDate && lastDate ? `, ${formatDate(firstDate)} – ${formatDate(lastDate)}. ` : ". "}
                  Source: <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[var(--color-text)]">GitHub</a>
                </span>
                <div className="flex items-center gap-1" aria-label="Contribution intensity legend">
                  <span className="mr-1">Less</span>
                  {contributionColors.map((color) => <span key={color} className="size-[13px] rounded-[3px]" style={{ backgroundColor: color }} />)}
                  <span className="ml-1">More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGitHub;
