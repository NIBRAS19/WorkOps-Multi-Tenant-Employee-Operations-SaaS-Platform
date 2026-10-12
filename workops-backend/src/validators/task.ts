import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().optional(),
    assigneeId: z.string().optional(),
    priority: z.enum(["low","medium","high","urgent"]).default("medium"),
    status: z.enum(["todo","in_progress","review","completed"]).default("todo"),
    dueDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([])
  }),
  params: z.any(),
  query: z.any()
});

export const updateTaskSchema = z.object({
  body: createTaskSchema.shape.body.partial(),
  params: z.object({ id: z.string() }),
  query: z.any()
});
