import { z } from "zod";

export const policySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    code: z.string().min(2).max(20),
    annualAllowance: z.coerce.number().min(0),
    carryForward: z.boolean().default(false),
    approvalRequired: z.boolean().default(true),
    attachmentRequired: z.boolean().default(false),
    active: z.boolean().default(true)
  }),
  params: z.any(),
  query: z.any()
});

export const requestSchema = z.object({
  body: z.object({
    employeeId: z.string().optional(),
    leavePolicyId: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    reason: z.string().min(3),
    attachmentUrl: z.string().optional()
  }),
  params: z.any(),
  query: z.any()
});

export const reviewSchema = z.object({
  body: z.object({
    action: z.enum(["approve","reject"]),
    rejectionReason: z.string().optional()
  }),
  params: z.object({ id: z.string() }),
  query: z.any()
});
