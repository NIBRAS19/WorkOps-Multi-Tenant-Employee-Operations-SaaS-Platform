import type { Request, Response } from "express";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";
import { createNotification } from "../services/notification.service.js";
import { User } from "../models/User.js";

async function actorEmployee(req: Request) {
  const employee = await Employee.findOne({ organizationId: req.auth!.organizationId, userId: req.auth!.userId });
  if (!employee) throw new ApiError(404, "Employee profile not linked.", "EMPLOYEE_NOT_LINKED");
  return employee;
}
export async function list(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  const items = await ServiceRequest.find(filter).populate("requesterId assigneeId").sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const requester = await actorEmployee(req);
  const item = await ServiceRequest.create({ ...req.body, organizationId: req.auth!.organizationId, requesterId: requester._id });
  await audit(req, "created", "Request", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function update(req: Request, res: Response) {
  const item = await ServiceRequest.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Request not found.", "REQUEST_NOT_FOUND");

  if (req.body.comment) {
    const actor = await actorEmployee(req);
    item.comments.push({ authorId: actor._id, body: req.body.comment, createdAt: new Date() } as any);
  }
  if (req.body.status) item.status = req.body.status;
  if (req.body.priority) item.priority = req.body.priority;
  if (req.body.assigneeId) item.assigneeId = req.body.assigneeId;
  await item.save();

  if (item.assigneeId) {
    const assignee = await Employee.findById(item.assigneeId).lean();
    if (assignee?.userId) {
      await createNotification({
        organizationId: req.auth!.organizationId,
        userId: String(assignee.userId),
        type: "request",
        title: "Request assigned",
        body: item.title,
        data: { requestId: String(item._id) }
      });
    }
  }

  await audit(req, "updated", "Request", String(item._id));
  res.json({ success: true, data: item });
}
