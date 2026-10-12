import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const leaveRequestSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
  leavePolicyId: { type: Schema.Types.ObjectId, ref: "LeavePolicy", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 0 },
  reason: { type: String, required: true },
  attachmentUrl: String,
  status: { type: String, enum: ["pending","approved","rejected","cancelled"], default: "pending" },
  approverId: { type: Schema.Types.ObjectId, ref: "Employee" },
  reviewedAt: Date,
  rejectionReason: String
}, { timestamps: true });
leaveRequestSchema.index({ organizationId: 1, employeeId: 1, startDate: 1 });
export type LeaveRequestDocument = InferSchemaType<typeof leaveRequestSchema>;
export const LeaveRequest = model("LeaveRequest", leaveRequestSchema);
