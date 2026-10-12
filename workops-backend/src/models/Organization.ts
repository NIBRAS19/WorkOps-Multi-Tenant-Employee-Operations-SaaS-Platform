import { Schema, model, type InferSchemaType } from "../sqlite/index.js";

const organizationSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  logoUrl: String,
  industry: String,
  country: String,
  timezone: { type: String, default: "Asia/Dubai" },
  settings: {
    workWeek: { type: [Number], default: [1,2,3,4,5] },
    workdayStart: { type: String, default: "09:00" },
    workdayEnd: { type: String, default: "18:00" },
    attendanceGraceMinutes: { type: Number, default: 10 },
    defaultLanguage: { type: String, default: "en" }
  },
  subscription: {
    plan: { type: String, enum: ["starter","growth","business","enterprise"], default: "starter" },
    status: { type: String, enum: ["trialing","active","past_due","canceled"], default: "trialing" },
    trialEndsAt: Date
  }
}, { timestamps: true });

export type OrganizationDocument = InferSchemaType<typeof organizationSchema>;
export const Organization = model("Organization", organizationSchema);
