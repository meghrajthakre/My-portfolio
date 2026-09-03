import { Router } from "express";
import {
  endVisit,
  getPublicVisitSummary,
  getVisitStats,
  startVisit,
} from "../controllers/visitController.js";
import { requireAnalyticsAdmin } from "../middleware/adminMiddleware.js";

const router = Router();

router.post("/start", startVisit);
router.post("/end", endVisit);
router.get("/summary", getPublicVisitSummary);
router.get("/stats", requireAnalyticsAdmin, getVisitStats);

export default router;
