import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import messageRoutes from "./routes/messageRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const error = new Error("This origin is not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
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
