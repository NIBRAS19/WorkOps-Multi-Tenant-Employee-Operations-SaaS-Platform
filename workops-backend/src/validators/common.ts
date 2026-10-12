import { z } from "zod";

export const idParam = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.any(),
  body: z.any()
});

export const listQuery = z.object({
  params: z.any(),
  body: z.any(),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    status: z.string().optional()
  })
});
