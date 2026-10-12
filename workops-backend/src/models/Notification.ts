import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const notificationSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: String,
  readAt: Date,
  data: Schema.Types.Mixed
}, { timestamps: true });
notificationSchema.index({ userId: 1, readAt: 1 });
export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export const Notification = model("Notification", notificationSchema);
