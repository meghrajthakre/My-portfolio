import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ActivityCalendar from "react-activity-calendar";
import GitHubActivitySkeleton from "../../Loader/GitHubActivitySkeleton";
import { getGithubContributions } from "../../../services/githubService";

const USERNAME = "meghrajthakre";
const PROFILE_URL = `https://github.com/${USERNAME}`;
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
    return cached?.data?.contributions?.length ? cached : null;
  } catch {
    return null;
  }
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});
const formatDate = (value) =>
  dateFormatter.format(new Date(`${value}T12:00:00`)).replaceAll("/", ".");

// Current streak: counts back from the latest day (today may still be empty)
const getCurrentStreak = (days) => {
  let i = days.length - 1;
  if (days[i]?.count === 0) i -= 1;
  let streak = 0;
  while (i >= 0 && days[i].count > 0) {
    streak += 1;
    i -= 1;
  }
  return streak;
};

const HomeGitHub = () => {
  const cached = useMemo(readCache, []);
  const [githubData, setGithubData] = useState(cached?.data ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(false);
  const [hovered, setHovered] = useState(null);
  const calendarRef = useRef(null);
  const scrollRef = useRef(null);

  // Fetch (skipped while the cache is fresh)
  useEffect(() => {
    if (cached && Date.now() - cached.savedAt < CACHE_TTL) return undefined;

    const controller = new AbortController();
    (async () => {
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
    })();

    return () => controller.abort();
  }, [cached]);

  const contributions = githubData?.contributions ?? [];
  const totalContributions =
    githubData?.total?.lastYear ?? contributions.reduce((sum, day) => sum + day.count, 0);
  const streak = useMemo(() => getCurrentStreak(contributions), [contributions]);
  const firstDate = contributions[0]?.date;
  const lastDate = contributions.at(-1)?.date;

  // Open on the latest weeks (important on small screens)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [contributions.length]);

  // Tooltip position is measured relative to the calendar box
  const showTooltip = useCallback((event, activity) => {
    const bounds = calendarRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setHovered({
      activity,
      x: Math.min(Math.max(event.clientX - bounds.left, 90), bounds.width - 90),
      y: event.clientY - bounds.top,
    });
  }, []);

  // Tapping anywhere else (or scrolling) closes a tooltip opened by touch
  useEffect(() => {
    if (!hovered) return undefined;
    const close = () => setHovered(null);
    const scroller = scrollRef.current;
    scroller?.addEventListener("scroll", close, { passive: true });
    document.addEventListener("pointerdown", (e) => {
      if (!calendarRef.current?.contains(e.target)) close();
    }, { once: true });
    return () => scroller?.removeEventListener("scroll", close);
  }, [hovered]);

  if (loading && !githubData) return <GitHubActivitySkeleton section />;

  const tooltipText = hovered
    ? `${hovered.activity.count === 0 ? "No" : hovered.activity.count} ${
        hovered.activity.count === 1 ? "contribution" : "contributions"
      } on ${formatDate(hovered.activity.date)}`
    : "";

  return (
    <section className="w-full py-4 text-[var(--color-text)]">
      <div className="flex items-end justify-between gap-3">
        <div className="gap-0.5">
          <h3 className="text-base md:text-lg">Featured</h3>
          <h2 className="mb-1 text-xl">GitHub Activity</h2>
        </div>
        {!error && (
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 text-sm underline underline-offset-4 hover:opacity-70"
          >
            @{USERNAME} ↗
          </a>
        )}
      </div>

      {error && !githubData ? (
        <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 text-center">
          <p className="text-sm text-[var(--color-secondary-text)]">
            GitHub activity is temporarily unavailable.
          </p>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold underline underline-offset-4"
          >
            View GitHub profile
          </a>
        </div>
      ) : (
        <div className="github-calendar mt-5 w-full max-w-full rounded-xl border border-dashed border-[var(--color-border)] p-6 text-[var(--github-calendar-muted)] sm:p-7 md:py-9">
          <div ref={scrollRef} className="github-calendar-scroll overflow-x-auto md:overflow-x-hidden">
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
                renderBlock={(block, activity) =>
                  React.cloneElement(block, {
                    onMouseEnter: (e) => showTooltip(e, activity),
                    onMouseLeave: () => setHovered(null),
                    onClick: (e) => showTooltip(e, activity), // touch devices
                    style: { ...block.props.style, cursor: "pointer" },
                  })
                }
              />

              {hovered && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-[var(--color-text)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] shadow-xl"
                  style={{ left: hovered.x, top: hovered.y }}
                >
                  {tooltipText}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <span>
              <strong className="font-semibold text-[var(--color-text)]">
                {totalContributions.toLocaleString("en-IN")}
              </strong>{" "}
              contributions
              {firstDate && lastDate ? `, ${formatDate(firstDate)} – ${formatDate(lastDate)}` : ""}
              {streak > 1 && (
                <>
                  {" · "}
                  <span className="text-[var(--color-text)]">{streak}-day streak</span>
                </>
              )}
            </span>
            <div className="flex items-center gap-1" aria-label="Contribution intensity legend">
              <span className="mr-1">Less</span>
              {contributionColors.map((color) => (
                <span key={color} className="size-[13px] rounded-[3px]" style={{ backgroundColor: color }} />
              ))}
              <span className="ml-1">More</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGitHub;