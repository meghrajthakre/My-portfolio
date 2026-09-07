import { useEffect, useState } from "react";
import { getVisitSummary } from "../../services/analyticsService";

const initialStats = {
  totalVisits: null,
  uniqueVisitors: null,
};

const FooterAnalytics = () => {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const controller = new AbortController();

    getVisitSummary({ signal: controller.signal })
      .then((data) => {
        setStats({
          totalVisits: data.totalVisits,
          uniqueVisitors: data.uniqueVisitors,
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStats(initialStats);
      });

    return () => controller.abort();
  }, []);

  return (
    <div
      className="flex items-center justify-center gap-2 whitespace-nowrap text-center text-xs text-[var(--color-secondary-text)]"
      aria-label={`${stats.totalVisits ?? 0} visits from ${stats.uniqueVisitors ?? 0} unique users`}
      aria-live="polite"
      title={`${stats.uniqueVisitors ?? 0} unique visitors`}
    >
      <span
        className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.75)]"
        aria-hidden="true"
      />
      <strong className="font-semibold tabular-nums text-[var(--color-text)]">
        {stats.totalVisits === null ? "—" : stats.totalVisits.toLocaleString("en-IN")}
      </strong>
      <span>Humans Were Here</span>
    </div>
  );
};

export default FooterAnalytics;
