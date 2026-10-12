import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const teamSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
  name: { type: String, required: true, trim: true },
  description: String,
  managerId: { type: Schema.Types.ObjectId, ref: "Employee" }
}, { timestamps: true });
teamSchema.index({ organizationId: 1, name: 1 }, { unique: true });
export type TeamDocument = InferSchemaType<typeof teamSchema>;
export const Team = model("Team", teamSchema);
