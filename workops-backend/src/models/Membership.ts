import { Schema, model, type InferSchemaType } from "../sqlite/index.js";

const membershipSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  role: { type: String, enum: ["owner","admin","manager","employee"], default: "employee" },
  roleId: { type: Schema.Types.ObjectId, ref: "Role" },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee" },
  status: { type: String, enum: ["active","invited","suspended"], default: "active" },
  joinedAt: Date
}, { timestamps: true });

membershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
export type MembershipDocument = InferSchemaType<typeof membershipSchema>;
export const Membership = model("Membership", membershipSchema);
