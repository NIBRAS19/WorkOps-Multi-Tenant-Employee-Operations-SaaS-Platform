import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const leavePolicySchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  annualAllowance: { type: Number, required: true, min: 0 },
  carryForward: { type: Boolean, default: false },
  approvalRequired: { type: Boolean, default: true },
  attachmentRequired: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });
leavePolicySchema.index({ organizationId: 1, code: 1 }, { unique: true });
export type LeavePolicyDocument = InferSchemaType<typeof leavePolicySchema>;
export const LeavePolicy = model("LeavePolicy", leavePolicySchema);
