import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { employeeRouter } from "./routes/employee.routes.js";
import { departmentRouter } from "./routes/department.routes.js";
import { attendanceRouter } from "./routes/attendance.routes.js";
import { leaveRouter } from "./routes/leave.routes.js";
import { taskRouter } from "./routes/task.routes.js";
import { requestRouter } from "./routes/request.routes.js";
import { documentRouter } from "./routes/document.routes.js";
import { assetRouter } from "./routes/asset.routes.js";
import { announcementRouter } from "./routes/announcement.routes.js";
import { notificationRouter } from "./routes/notification.routes.js";
import { calendarRouter } from "./routes/calendar.routes.js";
import { auditRouter } from "./routes/audit.routes.js";
import { settingsRouter } from "./routes/settings.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { reportRouter } from "./routes/report.routes.js";
import { notFound, errorHandler } from "./middlewares/error.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(cors({
    origin: env.clientUrl.split(",").map((v) => v.trim()),
    credentials: true
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.nodeEnv === "production" ? 300 : 1000,
    standardHeaders: "draft-7",
    legacyHeaders: false
  }));

  app.get("/", (_req, res) => res.json({ success: true, service: "WorkOps API", version: "v1" }));
  app.use("/health", healthRouter);
  app.use("/api/v1/health", healthRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/employees", employeeRouter);
  app.use("/api/v1/departments", departmentRouter);
  app.use("/api/v1/attendance", attendanceRouter);
  app.use("/api/v1/leave", leaveRouter);
  app.use("/api/v1/tasks", taskRouter);
  app.use("/api/v1/requests", requestRouter);
  app.use("/api/v1/documents", documentRouter);
  app.use("/api/v1/assets", assetRouter);
  app.use("/api/v1/announcements", announcementRouter);
  app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/calendar", calendarRouter);
  app.use("/api/v1/audit-logs", auditRouter);
  app.use("/api/v1/settings", settingsRouter);
  app.use("/api/v1/reports", reportRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
