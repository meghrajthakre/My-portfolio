import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    visitorId: { type: String, required: true, trim: true, maxlength: 64, index: true },
    sessionId: { type: String, required: true, trim: true, maxlength: 64, unique: true },
    path: { type: String, required: true, maxlength: 500 },
    paths: { type: [String], default: [] },
    startedAt: { type: Date, required: true, default: Date.now, index: true },
    endedAt: { type: Date, default: null },
    duration: { type: Number, min: 0, max: 86400, default: 0 },
  },
  { timestamps: true },
);

visitSchema.index({ startedAt: -1, path: 1 });

export const Visit = mongoose.model("Visit", visitSchema);
