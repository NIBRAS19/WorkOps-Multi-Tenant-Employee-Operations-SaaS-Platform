import { z } from "zod";

export const announcementSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    message: z.string().min(3),
    audience: z.enum(["all","department","team"]).default("all"),
    departmentId: z.string().optional(),
    teamId: z.string().optional(),
    publishAt: z.coerce.date().optional(),
    expiresAt: z.coerce.date().optional()
  }),
  params: z.any(),
  query: z.any()
});
