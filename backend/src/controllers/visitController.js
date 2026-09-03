import { Visit } from "../models/Visit.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_DURATION_SECONDS = 86400;
const PUBLIC_SUMMARY_TTL = 60 * 1000;
let publicSummaryCache = null;

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const validateId = (value, field) => {
  if (typeof value !== "string" || value.length > 64 || !ID_PATTERN.test(value)) {
    throw badRequest(`${field} must be a valid UUID`);
  }
  return value;
};

const validatePath = (value) => {
  if (
    typeof value !== "string"
    || value.length < 1
    || value.length > 500
    || !value.startsWith("/")
    || /[\u0000-\u001f\u007f]/.test(value)
  ) {
    throw badRequest("path must be a valid relative path of at most 500 characters");
  }
  return value;
};

export const startVisit = asyncHandler(async (req, res) => {
  const visitorId = validateId(req.body?.visitorId, "visitorId");
  const sessionId = validateId(req.body?.sessionId, "sessionId");
  const path = validatePath(req.body?.path);

  let result;
  try {
    result = await Visit.updateOne(
      { sessionId },
      {
        $setOnInsert: { visitorId, sessionId, path, startedAt: new Date() },
        $addToSet: { paths: path },
      },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  } catch (error) {
    // Concurrent StrictMode requests can race on the unique sessionId index.
    if (error.code !== 11000) throw error;
    result = await Visit.updateOne({ sessionId }, { $addToSet: { paths: path } }, { runValidators: true });
  }

  publicSummaryCache = null;

  res.status(result.upsertedCount === 1 ? 201 : 200).json({
    success: true,
    created: result.upsertedCount === 1,
  });
});

export const endVisit = asyncHandler(async (req, res) => {
  const sessionId = validateId(req.body?.sessionId, "sessionId");
  const rawDuration = req.body?.duration;
  const duration = Number(rawDuration);

  if (
    (typeof rawDuration !== "number" && typeof rawDuration !== "string")
    || (typeof rawDuration === "string" && rawDuration.trim() === "")
    || !Number.isFinite(duration)
    || duration < 0
    || duration > MAX_DURATION_SECONDS
  ) {
    throw badRequest(`duration must be between 0 and ${MAX_DURATION_SECONDS} seconds`);
  }

  const visit = await Visit.findOneAndUpdate(
    { sessionId },
    { endedAt: new Date(), duration: Math.floor(duration) },
    { new: true, runValidators: true },
  );

  if (!visit) {
    const error = new Error("Visit session not found");
    error.status = 404;
    throw error;
  }

  publicSummaryCache = null;

  res.status(200).json({ success: true });
});

export const getVisitStats = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [summary, todayVisits, topPages] = await Promise.all([
    Visit.aggregate([
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
          totalTimeSpent: { $sum: "$duration" },
          averageTimeSpent: { $avg: "$duration" },
        },
      },
    ]),
    Visit.countDocuments({ startedAt: { $gte: startOfToday } }),
    Visit.aggregate([
      { $project: { trackedPaths: { $cond: [{ $gt: [{ $size: "$paths" }, 0] }, "$paths", ["$path"]] } } },
      { $unwind: "$trackedPaths" },
      { $group: { _id: "$trackedPaths", visits: { $sum: 1 } } },
      { $sort: { visits: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, path: "$_id", visits: 1 } },
    ]),
  ]);

  const totals = summary[0];
  res.status(200).json({
    totalVisits: totals?.totalVisits ?? 0,
    uniqueVisitors: totals?.uniqueVisitors.length ?? 0,
    totalTimeSpent: totals?.totalTimeSpent ?? 0,
    averageTimeSpent: Math.round(totals?.averageTimeSpent ?? 0),
    todayVisits,
    topPages,
  });
});

export const getPublicVisitSummary = asyncHandler(async (req, res) => {
  if (publicSummaryCache && Date.now() - publicSummaryCache.savedAt < PUBLIC_SUMMARY_TTL) {
    return res.status(200).json(publicSummaryCache.data);
  }

  const [summary, onlineVisitors] = await Promise.all([
    Visit.aggregate([
      {
        $group: {
          _id: null,
          totalVisits: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" },
        },
      },
    ]),
    Visit.countDocuments({ endedAt: null }),
  ]);

  const data = {
    totalVisits: summary?.totalVisits ?? 0,
    uniqueVisitors: summary?.uniqueVisitors.length ?? 0,
    onlineVisitors,
  };
  publicSummaryCache = { data, savedAt: Date.now() };

  return res.status(200).json(data);
});
