import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validate(schema: ZodType): RequestHandler {
  return async (req, _res, next) => {
    try {
      const data = await schema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body
      });
      if (data && typeof data === "object") {
        const parsed = data as { params?: unknown; query?: unknown; body?: unknown };
        if (parsed.params !== undefined && req.params) Object.assign(req.params, parsed.params);
        if (parsed.query !== undefined && req.query) Object.assign(req.query, parsed.query);
        if (parsed.body !== undefined) req.body = parsed.body;
      }
      next();
    } catch (e) {
      next(e);
    }
  };
}
