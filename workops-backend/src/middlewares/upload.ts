import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { env } from "../config/env.js";

fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, safeExt).replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 80);
    cb(null, `${Date.now()}-${base}${safeExt}`);
  }
});

export const uploadSingle = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 }
}).single("file");
