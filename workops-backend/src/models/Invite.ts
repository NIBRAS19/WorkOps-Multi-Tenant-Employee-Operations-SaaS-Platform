import { Schema, model, type InferSchemaType } from "../sqlite/index.js";

const inviteSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  role: { type: String, enum: ["admin","manager","employee"], default: "employee" },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  acceptedAt: Date,
  invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export type InviteDocument = InferSchemaType<typeof inviteSchema>;
export const Invite = model("Invite", inviteSchema);
