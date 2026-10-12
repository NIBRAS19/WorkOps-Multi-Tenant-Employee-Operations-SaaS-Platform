import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "sqlite",
  sqlitePath: process.env.SQLITE_PATH ?? "./storage/workops.db",
  accessSecret: process.env.JWT_ACCESS_SECRET ?? "workops-dev-jwt-access-secret-32-chars-minimum",
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? "workops-dev-jwt-refresh-secret-32-chars-minimum",
  accessTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
  refreshTtl: process.env.REFRESH_TOKEN_TTL ?? "7d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  cookieSecure: process.env.COOKIE_SECURE === "true",
  uploadDir: process.env.UPLOAD_DIR ?? "./storage/uploads",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB ?? 10),
  logLevel: process.env.LOG_LEVEL ?? "info"
} as const;
