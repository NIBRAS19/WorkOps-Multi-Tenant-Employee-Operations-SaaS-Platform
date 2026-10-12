import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const requestSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  requesterId: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  category: { type: String, enum: ["it_support","work_from_home","document","equipment","travel","other"], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ["low","medium","high","urgent"], default: "medium" },
  status: { type: String, enum: ["pending","assigned","in_progress","waiting","resolved","closed"], default: "pending" },
  assigneeId: { type: Schema.Types.ObjectId, ref: "Employee" },
  comments: [{
    authorId: { type: Schema.Types.ObjectId, ref: "Employee" },
    body: String,
    createdAt: { type: Date, default: Date.now }
  }],
  attachments: [String]
}, { timestamps: true });
export type ServiceRequestDocument = InferSchemaType<typeof requestSchema>;
export const ServiceRequest = model("ServiceRequest", requestSchema);
