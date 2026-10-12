import type { ErrorRequestHandler, RequestHandler } from "express";
import { mongoose } from "../sqlite/index.js";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";
import { logger } from "../config/logger.js";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error({ err, path: req.path, method: req.method }, "request_error");

  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: err.flatten()
      }
    });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(422).json({
      success: false,
      error: { code: "MODEL_VALIDATION_ERROR", message: err.message }
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_ID", message: "One or more resource identifiers are invalid." }
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {})
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." }
  });
};
