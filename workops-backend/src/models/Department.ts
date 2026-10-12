import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const departmentSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: String,
  headEmployeeId: { type: Schema.Types.ObjectId, ref: "Employee" }
}, { timestamps: true });
departmentSchema.index({ organizationId: 1, name: 1 }, { unique: true });
export type DepartmentDocument = InferSchemaType<typeof departmentSchema>;
export const Department = model("Department", departmentSchema);
