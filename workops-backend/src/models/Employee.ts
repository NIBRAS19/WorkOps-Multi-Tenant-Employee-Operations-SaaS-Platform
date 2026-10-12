import { Schema, model, type InferSchemaType } from "../sqlite/index.js";

const employeeSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  employeeCode: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: String,
  jobTitle: String,
  departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
  teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  managerId: { type: Schema.Types.ObjectId, ref: "Employee" },
  employmentType: { type: String, enum: ["full_time","part_time","contractor","intern"], default: "full_time" },
  workMode: { type: String, enum: ["office","hybrid","remote"], default: "office" },
  location: String,
  joiningDate: Date,
  status: { type: String, enum: ["active","inactive","on_leave","invited"], default: "active" },
  avatarUrl: String,
  notes: String
}, { timestamps: true });
employeeSchema.index({ organizationId: 1, employeeCode: 1 }, { unique: true });
employeeSchema.index({ organizationId: 1, email: 1 });
export type EmployeeDocument = InferSchemaType<typeof employeeSchema>;
export const Employee = model("Employee", employeeSchema);
