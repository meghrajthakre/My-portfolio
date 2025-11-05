import React, { useEffect, useState } from "react";

const Wakatime = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_WAKATIME_API_KEY;

  useEffect(() => {
    const fetchWakaTimeStats = async () => {
      try {
        const response = await fetch(
          "https://api.allorigins.win/raw?url=" +
            encodeURIComponent("https://wakatime.com/api/v1/users/current/stats/last_7_days"),
          {
            headers: {
              Authorization: `Basic ${btoa(apiKey)}`,
            },
          }
        );

        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching WakaTime stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWakaTimeStats();
  }, [apiKey]);

  if (loading)
    return (
      <div className="rounded-xl bg-[#0d1117] p-4 animate-pulse">
        <h2 className="text-xl font-semibold mb-2 text-gray-400">
          Loading WakaTime Stats...
        </h2>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    );

  if (!data) return <p className="text-red-400 flex items-end">Failed to load Daily Time  😞</p>;

  return (
    <div className="text-white rounded-xl p-4 bg-[#0d1117] border border-gray-800">
      <h2 className="text-xl font-semibold mb-1">WakaTime Activity</h2>
      <p className="text-sm text-gray-400 mb-2">
        Last 7 Days — Total:{" "}
        <span className="text-green-400">
          {data.human_readable_total_including_other_language}
        </span>
      </p>

      <div className="space-y-2 text-sm">
        {data.languages.slice(0, 5).map((lang) => (
          <div
            key={lang.name}
            className="flex justify-between bg-gray-800/50 px-3 py-1 rounded-lg"
          >
            <span>{lang.name}</span>
            <span className="text-gray-300">{lang.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-sm">
        <span className="bg-green-600 px-2 py-1 rounded-md">🟢 Active</span>
        <span className="text-gray-400">Updated recently</span>
      </div>
    </div>
  );
};

export default Wakatime;
