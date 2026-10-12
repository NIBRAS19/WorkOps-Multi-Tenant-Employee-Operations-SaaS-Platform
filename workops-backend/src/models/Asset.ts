import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const assetSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  serialNumber: String,
  status: { type: String, enum: ["available","assigned","maintenance","lost","retired"], default: "available" },
  assignedTo: { type: Schema.Types.ObjectId, ref: "Employee" },
  assignedAt: Date,
  condition: String,
  notes: String
}, { timestamps: true });
export type AssetDocument = InferSchemaType<typeof assetSchema>;
export const Asset = model("Asset", assetSchema);
