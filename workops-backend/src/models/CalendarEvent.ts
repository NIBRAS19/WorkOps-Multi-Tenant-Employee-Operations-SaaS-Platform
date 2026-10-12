import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const calendarSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["leave","meeting","company_event","task","deadline","birthday","other"], default: "other" },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee" }
}, { timestamps: true });
export type CalendarEventDocument = InferSchemaType<typeof calendarSchema>;
export const CalendarEvent = model("CalendarEvent", calendarSchema);
