import http from "node:http";
import fs from "node:fs";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function main() {
  fs.mkdirSync(env.uploadDir, { recursive: true });
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info({ port: env.port }, "WorkOps API started");
  });

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "Shutting down");
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}

main().catch((error) => {
  logger.error(error, "Failed to start WorkOps API");
  process.exit(1);
});
