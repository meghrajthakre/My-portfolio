import { timingSafeEqual } from "node:crypto";

export const requireAnalyticsAdmin = (req, res, next) => {
  const configuredKey = process.env.ANALYTICS_ADMIN_KEY;
  const suppliedKey = req.get("x-admin-key");

  if (!configuredKey) {
    return res.status(503).json({ success: false, message: "Analytics admin access is not configured" });
  }
  if (!suppliedKey) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const expected = Buffer.from(configuredKey);
  const received = Buffer.from(suppliedKey);
  const isValid = expected.length === received.length && timingSafeEqual(expected, received);

  if (!isValid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return next();
};
