import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const announcementSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  audience: { type: String, enum: ["all","department","team"], default: "all" },
  departmentId: { type: Schema.Types.ObjectId, ref: "Department" },
  teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  publishAt: { type: Date, default: Date.now },
  expiresAt: Date,
  attachmentUrl: String,
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export type AnnouncementDocument = InferSchemaType<typeof announcementSchema>;
export const Announcement = model("Announcement", announcementSchema);
