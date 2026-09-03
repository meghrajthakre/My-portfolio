import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { beaconEndVisit, endVisit, startVisit } from "../services/analyticsService";

const VISITOR_ID_KEY = "portfolio:visitor-id";
const SESSION_ID_KEY = "portfolio:session-id";
const SESSION_START_KEY = "portfolio:session-start";

const getOrCreateId = (storage, key) => {
  const existing = storage.getItem(key);
  if (existing) return existing;

  const id = crypto.randomUUID();
  storage.setItem(key, id);
  return id;
};

export const useVisitorAnalytics = () => {
  const { pathname } = useLocation();
  const sessionRef = useRef(undefined);

  if (sessionRef.current === undefined) {
    try {
      const visitorId = getOrCreateId(localStorage, VISITOR_ID_KEY);
      const sessionId = getOrCreateId(sessionStorage, SESSION_ID_KEY);
      const storedStart = Number(sessionStorage.getItem(SESSION_START_KEY));
      const startTime = Number.isFinite(storedStart) && storedStart > 0 ? storedStart : Date.now();

      sessionStorage.setItem(SESSION_START_KEY, String(startTime));
      sessionRef.current = { visitorId, sessionId, startTime };
    } catch {
      // Analytics must never prevent the portfolio from rendering.
      sessionRef.current = null;
    }
  }

  useEffect(() => {
    if (!sessionRef.current) return;
    const { visitorId, sessionId } = sessionRef.current;
    startVisit({ visitorId, sessionId, path: pathname }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (!sessionRef.current) return undefined;

    const finishVisit = () => {
      const { sessionId, startTime } = sessionRef.current;
      const duration = Math.min(86400, Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
      const payload = { sessionId, duration };

      if (!beaconEndVisit(payload)) endVisit(payload).catch(() => {});
    };

    window.addEventListener("pagehide", finishVisit);
    return () => window.removeEventListener("pagehide", finishVisit);
  }, []);
};
