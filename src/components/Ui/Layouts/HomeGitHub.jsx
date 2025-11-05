import React, { useState, useEffect, Suspense } from "react";
import Wakatime from "../../Loader/Wakatime";

const GitHubCalendar = React.lazy(() => import("react-github-calendar"));

const HomeGitHub = () => {
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);

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
    <div className="py-15 rounded-xl text-white w-full">
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
          <span className="text-sm flex gap-1 mt-2 text-[var(--color-text)]">
            Total:{" "}
            <h4 className="font-bold text-md text-[var(--color-text)]">
              {totalContributions}
            </h4>{" "}
            contributions
          </span>

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
            <div className="dashed overflow-x-hidden  p-6 text-[var(--color-text)] rounded-lg border-[var(--color-border)]">
              <GitHubCalendar
                username="meghrajthakre"
                blockSize={9}
                blockMargin={3}
                fontSize={14}
                color="text-color"
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
            </div>
          </Suspense>
        </>
      )}
    </div>
  );
};

export default HomeGitHub;
