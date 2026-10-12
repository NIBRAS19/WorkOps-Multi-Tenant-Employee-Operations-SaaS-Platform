import { z } from "zod";

export const updateSettingsSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    logoUrl: z.string().url().optional(),
    industry: z.string().optional(),
    country: z.string().optional(),
    timezone: z.string().optional(),
    workWeek: z.array(z.number().int().min(0).max(6)).optional(),
    workdayStart: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    workdayEnd: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    attendanceGraceMinutes: z.number().int().min(0).max(120).optional()
  }),
  params: z.any(),
  query: z.any()
});
