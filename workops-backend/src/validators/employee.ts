import { z } from "zod";

const body = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  departmentId: z.string().optional(),
  teamId: z.string().optional(),
  managerId: z.string().optional(),
  employmentType: z.enum(["full_time","part_time","contractor","intern"]).default("full_time"),
  workMode: z.enum(["office","hybrid","remote"]).default("office"),
  location: z.string().optional(),
  joiningDate: z.coerce.date().optional(),
  status: z.enum(["active","inactive","on_leave","invited"]).default("active"),
  notes: z.string().optional()
});

export const createEmployeeSchema = z.object({ body, params: z.any(), query: z.any() });
export const updateEmployeeSchema = z.object({ body: body.partial(), params: z.object({ id: z.string() }), query: z.any() });
export const employeeIdSchema = z.object({ body: z.any(), params: z.object({ id: z.string() }), query: z.any() });
