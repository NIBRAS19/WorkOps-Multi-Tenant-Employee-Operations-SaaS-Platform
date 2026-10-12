import { z } from "zod";

export const createRequestSchema = z.object({
  body: z.object({
    category: z.enum(["it_support","work_from_home","document","equipment","travel","other"]),
    title: z.string().min(2),
    description: z.string().min(3),
    priority: z.enum(["low","medium","high","urgent"]).default("medium")
  }),
  params: z.any(),
  query: z.any()
});

export const updateRequestSchema = z.object({
  body: z.object({
    status: z.enum(["pending","assigned","in_progress","waiting","resolved","closed"]).optional(),
    priority: z.enum(["low","medium","high","urgent"]).optional(),
    assigneeId: z.string().optional(),
    comment: z.string().optional()
  }),
  params: z.object({ id: z.string() }),
  query: z.any()
});
