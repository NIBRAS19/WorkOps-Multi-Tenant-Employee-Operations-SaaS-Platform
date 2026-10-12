import { Schema, model, type InferSchemaType } from "../sqlite/index.js";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  avatarUrl: String,
  emailVerified: { type: Boolean, default: false },
  status: { type: String, enum: ["active","inactive","invited"], default: "active" },
  lastLoginAt: Date
}, { timestamps: true });

userSchema.index({ email: 1 });
export type UserDocument = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
