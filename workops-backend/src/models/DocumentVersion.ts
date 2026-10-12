import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const versionSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true, index: true },
  version: { type: Number, required: true },
  originalName: String,
  fileName: { type: String, required: true },
  storagePath: { type: String, required: true },
  mimeType: String,
  size: Number,
  changeNote: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
versionSchema.index({ documentId: 1, version: 1 }, { unique: true });
export type DocumentVersionDocument = InferSchemaType<typeof versionSchema>;
export const DocumentVersion = model("DocumentVersion", versionSchema);
