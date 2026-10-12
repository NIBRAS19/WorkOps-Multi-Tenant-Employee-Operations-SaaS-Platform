import type { Request, Response } from "express";
import { LeavePolicy } from "../models/LeavePolicy.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";
import { createNotification } from "../services/notification.service.js";

function countDays(start: Date, end: Date) {
  const startMs = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endMs = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return Math.floor((endMs - startMs) / 86400000) + 1;
}

async function resolveEmployee(req: Request, employeeId?: string) {
  if (employeeId && ["owner","admin","manager"].includes(req.auth!.role)) {
    const employee = await Employee.findOne({ _id: employeeId, organizationId: req.auth!.organizationId });
    if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
    return employee;
  }
  const employee = await Employee.findOne({ organizationId: req.auth!.organizationId, userId: req.auth!.userId });
  if (!employee) throw new ApiError(404, "Employee profile not linked.", "EMPLOYEE_NOT_LINKED");
  return employee;
}

export async function listPolicies(req: Request, res: Response) {
  const data = await LeavePolicy.find({ organizationId: req.auth!.organizationId }).sort({ name: 1 }).lean();
  res.json({ success: true, data });
}
export async function createPolicy(req: Request, res: Response) {
  const item = await LeavePolicy.create({ ...req.body, organizationId: req.auth!.organizationId });
  await audit(req, "created", "LeavePolicy", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function listRequests(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.employeeId) filter.employeeId = req.query.employeeId;
  const items = await LeaveRequest.find(filter).populate("employeeId leavePolicyId approverId").sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function createRequest(req: Request, res: Response) {
  const employee = await resolveEmployee(req, req.body.employeeId);
  const policy = await LeavePolicy.findOne({ _id: req.body.leavePolicyId, organizationId: req.auth!.organizationId, active: true });
  if (!policy) throw new ApiError(404, "Leave policy not found.", "LEAVE_POLICY_NOT_FOUND");
  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  if (end < start) throw new ApiError(422, "End date cannot be before start date.", "INVALID_DATE_RANGE");
  const days = countDays(start, end);
  const item = await LeaveRequest.create({
    ...req.body,
    organizationId: req.auth!.organizationId,
    employeeId: employee._id,
    startDate: start,
    endDate: end,
    days,
    status: policy.approvalRequired ? "pending" : "approved"
  });
  await audit(req, "created", "LeaveRequest", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function review(req: Request, res: Response) {
  const item = await LeaveRequest.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId }).populate("employeeId");
  if (!item) throw new ApiError(404, "Leave request not found.", "LEAVE_NOT_FOUND");
  if (!["pending"].includes(item.status)) throw new ApiError(409, "This request has already been reviewed.", "LEAVE_ALREADY_REVIEWED");
  const action = req.body.action;
  item.status = action === "approve" ? "approved" : "rejected";
  item.rejectionReason = action === "reject" ? req.body.rejectionReason : undefined;
  item.reviewedAt = new Date();
  const actorEmployee = await Employee.findOne({ organizationId: req.auth!.organizationId, userId: req.auth!.userId });
  item.approverId = (actorEmployee?._id ?? null) as any;
  await item.save();
  const emp = item.employeeId as any;
  if (emp?.userId) {
    await createNotification({
      organizationId: req.auth!.organizationId,
      userId: String(emp.userId),
      type: "leave",
      title: `Leave request ${item.status}`,
      body: action === "approve" ? "Your leave request was approved." : "Your leave request was rejected.",
      data: { leaveRequestId: String(item._id) }
    });
  }
  await audit(req, `${action}d`, "LeaveRequest", String(item._id));
  res.json({ success: true, data: item });
}
export async function cancel(req: Request, res: Response) {
  const item = await LeaveRequest.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!item) throw new ApiError(404, "Leave request not found.", "LEAVE_NOT_FOUND");
  item.status = "cancelled";
  await item.save();
  res.json({ success: true, data: item });
}
