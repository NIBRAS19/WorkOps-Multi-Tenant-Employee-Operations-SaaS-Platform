import { Router } from "express";
import { mongoose } from "../sqlite/index.js";

export const healthRouter = Router();
healthRouter.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      engine: "SQLite",
      timestamp: new Date().toISOString()
    }
  });
});
