import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const attendanceSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employee", required: true, index: true },
  date: { type: Date, required: true },
  clockIn: Date,
  clockOut: Date,
  totalMinutes: { type: Number, default: 0 },
  status: { type: String, enum: ["present","late","absent","remote","half_day"], default: "present" },
  source: { type: String, enum: ["web","mobile","admin"], default: "web" },
  notes: String
}, { timestamps: true });
attendanceSchema.index({ organizationId: 1, employeeId: 1, date: 1 }, { unique: true });
export type AttendanceDocument = InferSchemaType<typeof attendanceSchema>;
export const Attendance = model("Attendance", attendanceSchema);
