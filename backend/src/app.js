import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import messageRoutes from "./routes/messageRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MT Portfolio backend is running successfully 🚀",
  });
});

app.get("/api/health", (req, res) => {
  const database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    database,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/messages", messageRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/visits", visitRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
