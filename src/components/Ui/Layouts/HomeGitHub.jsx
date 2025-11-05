import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";

const HomeGitHub = () => {
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/meghrajthakre"
        );
        const data = await response.json();
        console.log(data);
        
        if (data.total && typeof data.total === "object") {
          const totalSum = Object.values(data.total).reduce((acc, val) => acc + val, 0);
          setTotalContributions(totalSum);
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false); // ✅ stop loading once done
      }
    };

    fetchContributions();
  }, []);

  return (
    <div className="py-15 rounded-xl text-white w-full">
      <h2 className="text-xl mb-1">GitHub Activity</h2>

      {loading ? (
        // ✅ Loading UI
        <div className="mt-5 flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Fetching contributions...</p>
        </div>
      ) : (
        <>
          <p className="text-sm mt-2 text-[var(--color-text)]">
            Total: {totalContributions} contributions
          </p>

          <p className="text-sm text-gray-400 mb-4">
            Total Contributions Overview
          </p>

          <div className="overflow-x-hidden border p-6 rounded-lg border-[var(--color-border)]">
            <GitHubCalendar
              username="meghrajthakre"
              blockSize={9}
              blockMargin={3}
              fontSize={16}
              colorScheme="dark"
            />
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="">🟢</span>
            <span className="text-gray-400">Updated recently</span>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeGitHub;
