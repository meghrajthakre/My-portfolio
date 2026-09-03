const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const END_VISIT_URL = `${API_BASE_URL}/api/visits/end`;

const post = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error("Analytics request failed");
};

export const startVisit = (payload) => post("/api/visits/start", payload);
export const endVisit = (payload) => post("/api/visits/end", payload);

export const getVisitSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/api/visits/summary`);
  if (!response.ok) throw new Error("Visitor summary request failed");
  return response.json();
};

export const beaconEndVisit = (payload) => {
  if (!navigator.sendBeacon) return false;

  // URL-encoded data avoids an unreliable CORS preflight during page exit.
  const body = new URLSearchParams({
    sessionId: payload.sessionId,
    duration: String(payload.duration),
  });
  return navigator.sendBeacon(END_VISIT_URL, body);
};
