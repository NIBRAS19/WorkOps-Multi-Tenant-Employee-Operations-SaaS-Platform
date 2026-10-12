import { z } from "zod";

const password = z.string().min(8).max(128);

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    password,
    companyName: z.string().min(2).max(120)
  }),
  params: z.any(),
  query: z.any()
});

export const loginSchema = z.object({
  body: z.object({ email: z.string().email(), password }),
  params: z.any(),
  query: z.any()
});

export const refreshSchema = z.object({
  body: z.object({ refreshToken: z.string().optional() }),
  params: z.any(),
  query: z.any()
});

export const acceptInviteSchema = z.object({
  body: z.object({
    token: z.string().min(20),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    password
  }),
  params: z.any(),
  query: z.any()
});
