import React, { useState, useEffect, useRef, Suspense } from "react";

const GitHubCalendar = React.lazy(() => import("react-github-calendar"));
const contributionColors = [
  "var(--github-level-0)",
  "var(--github-level-1)",
  "var(--github-level-2)",
  "var(--github-level-3)",
  "var(--github-level-4)",
];

const formatContributionDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date).replaceAll("/", ".");

const HomeGitHub = () => {
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredContribution, setHoveredContribution] = useState(null);
  const calendarRef = useRef(null);
  const rangeEnd = new Date();
  const rangeStart = new Date(rangeEnd);
  rangeStart.setDate(rangeStart.getDate() - 364);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/meghrajthakre"
        );
        const data = await response.json();

        if (data.total && typeof data.total === "object") {
          const totalSum = Object.values(data.total).reduce(
            (acc, val) => acc + val,
            0
          );
          setTotalContributions(totalSum);
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  return (
    <div className="py-4 rounded-xl text-[var(--color-text)] w-full">
      <div className="gap-0.5 md:text-left">
        <h3 className="text-base md:text-lg">Featured</h3>
        <h2 className="text-xl mb-1">GitHub Activity</h2>
      </div>

      {loading ? (
        <div className="mt-5 flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Fetching contributions...</p>
        </div>
      ) : (
        <>
         

          <div className="mt-3 flex  gap-3 text-sm  text-gray-500 items-baseline  justify-between">
            <h3 className="font-medium  mb-4">
              Total Contributions Overview
            </h3>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
              <h3 className="font-medium">
                This Year
              </h3>
            </div>

          </div>

          <Suspense
            fallback={
              <div className="flex justify-center mt-5 text-gray-400 text-sm">
                Loading calendar...
              </div>
            }
          >
            <div className="github-calendar github-calendar-scroll w-full max-w-full dashed overflow-x-auto rounded-xl border-[var(--color-border)] p-6 text-[var(--github-calendar-muted)] sm:p-7 md:overflow-x-hidden md:py-9">
              <div ref={calendarRef} className="relative min-w-[636px]">
              <GitHubCalendar
                username="meghrajthakre"
                blockSize={10}
                blockMargin={2}
                blockRadius={2}
                fontSize={14}
                color="text-color"
                hideTotalCount
                hideColorLegend
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
                  onMouseMove: (event) => {
                    const bounds = calendarRef.current?.getBoundingClientRect();
                    if (!bounds) return;
                    setHoveredContribution((current) => current && ({
                      ...current,
                      x: event.clientX - bounds.left,
                      y: event.clientY - bounds.top,
                    }));
                  },
                  onMouseLeave: () => setHoveredContribution(null),
                })}
                theme={{
                  light: [
                    "#EEEEEE", // 🩶 empty (official GitHub light gray)
                    "#156813", // 💚 level 1
                    "#40c463", // 💚 level 2
                    "#30a14e", // 💚 level 3
                    "#216e39", // 💚 level 4 (darkest)
                  ],
                  dark: [
                    "#7D7E7E", // empty
                    "#1DB213", // level 1
                    "#006d32", // level 2
                    "#26a641", // level 3
                    "#39d353", // level 4
                  ],
                }}

              />
                {hoveredContribution && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-lg bg-[var(--color-text)] px-3 py-2 text-xs font-medium text-[var(--color-bg)] shadow-xl"
                    style={{ left: hoveredContribution.x, top: hoveredContribution.y }}
                  >
                    {hoveredContribution.activity.count} {hoveredContribution.activity.count === 1 ? "contribution" : "contributions"} on {formatContributionDate(new Date(`${hoveredContribution.activity.date}T12:00:00`))}
                    <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--color-text)]" />
                  </div>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <span>
                    {totalContributions.toLocaleString("en-US")} contributions, {formatContributionDate(rangeStart)} – {formatContributionDate(rangeEnd)}. Source:{" "}
                    <a
                      href="https://github.com/meghrajthakre"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 transition-colors hover:text-[var(--color-text)]"
                    >
                      GitHub
                    </a>
                  </span>

                  <div className="flex items-center gap-1" aria-label="Contribution intensity legend">
                    <span className="mr-1">Less</span>
                    {contributionColors.map((color) => (
                      <span
                        key={color}
                        className="size-[14px] rounded-[3px]"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <span className="ml-1">More</span>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </>
      )}
    </div>
  );
};

export default HomeGitHub;
