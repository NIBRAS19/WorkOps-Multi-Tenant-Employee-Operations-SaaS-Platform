import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const auditSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  resourceType: { type: String, required: true },
  resourceId: Schema.Types.ObjectId,
  metadata: Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String
}, { timestamps: true });
auditSchema.index({ organizationId: 1, createdAt: -1 });
export type AuditLogDocument = InferSchemaType<typeof auditSchema>;
export const AuditLog = model("AuditLog", auditSchema);
