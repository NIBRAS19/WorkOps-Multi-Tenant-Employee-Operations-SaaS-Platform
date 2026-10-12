import { Schema, model, type InferSchemaType } from "../sqlite/index.js";
const taskSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: String,
  assigneeId: { type: Schema.Types.ObjectId, ref: "Employee" },
  reporterId: { type: Schema.Types.ObjectId, ref: "Employee" },
  priority: { type: String, enum: ["low","medium","high","urgent"], default: "medium" },
  status: { type: String, enum: ["todo","in_progress","review","completed"], default: "todo" },
  dueDate: Date,
  tags: [String],
  attachments: [String]
}, { timestamps: true });
export type TaskDocument = InferSchemaType<typeof taskSchema>;
export const Task = model("Task", taskSchema);
