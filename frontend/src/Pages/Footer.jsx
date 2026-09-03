import React, { useEffect, useState } from "react";
import Tooltip from "../common/Tooltip";
import { getVisitSummary } from "../services/analyticsService";

const Footer = () => {
  const [visitorStats, setVisitorStats] = useState(null);

  useEffect(() => {
    getVisitSummary()
      .then(setVisitorStats)
      .catch(() => setVisitorStats(null));
  }, []);

  return (
    <footer className="mx-auto max-w-3xl px-6 pb-10 pt-10 sm:px-8">
      {visitorStats && (
        <div className="mb-5 flex justify-center">
          <Tooltip text="Tracking visits since Sep 2026">
            <div
              className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-[color-mix(in_srgb,var(--color-border)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-card-bg)_72%,transparent)] px-4 py-2 text-xs shadow-sm backdrop-blur-md transition-colors hover:border-[color-mix(in_srgb,var(--logo-bg)_65%,var(--color-border))] sm:text-sm"
            >
              <span><strong className="font-semibold text-[var(--color-text)]">{visitorStats.totalVisits.toLocaleString("en-IN")}</strong> Visits</span>
              <span aria-hidden="true">·</span>
              <span><strong className="font-semibold text-[var(--color-text)]">{visitorStats.uniqueVisitors.toLocaleString("en-IN")}</strong> Explorers</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_7px_rgba(16,185,129,0.75)]" aria-hidden="true" />
                <strong className="font-semibold text-[var(--color-text)]">{visitorStats.onlineVisitors ?? 0}</strong> Online
              </span>
            </div>
          </Tooltip>
        </div>
      )}

      <div className="flex flex-col text-center text-[var(--color-secondary-text)]">
        <span className="text-sm sm:text-base">Design & Developed by Meghraj Thakre</span>
        <span className="text-sm sm:text-base">© 2026. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
