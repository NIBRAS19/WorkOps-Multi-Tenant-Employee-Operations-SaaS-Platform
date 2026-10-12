import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const documentSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, enum: ["employee","company","policy","contract","certificate","template","other"], default: "other" },
  visibility: { type: String, enum: ["private","team","organization"], default: "private" },
  ownerType: { type: String, enum: ["employee","organization"], default: "organization" },
  ownerId: { type: Schema.Types.ObjectId },
  currentVersionId: { type: Schema.Types.ObjectId, ref: "DocumentVersion" },
  status: { type: String, enum: ["active","archived"], default: "active" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
export type DocumentDocument = InferSchemaType<typeof documentSchema>;
export const Document = model("Document", documentSchema);
