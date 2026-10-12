import type { Request, Response } from "express";
import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

function dayStart(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
async function currentEmployee(req: Request) {
  const employee = await Employee.findOne({ organizationId: req.auth!.organizationId, userId: req.auth!.userId });
  if (!employee) throw new ApiError(404, "Employee profile not linked to your account.", "EMPLOYEE_NOT_LINKED");
  return employee;
}
export async function today(req: Request, res: Response) {
  const employee = await currentEmployee(req);
  const attendance = await Attendance.findOne({ organizationId: req.auth!.organizationId, employeeId: employee._id, date: dayStart() }).lean();
  res.json({ success: true, data: attendance });
}
export async function clockIn(req: Request, res: Response) {
  const employee = await currentEmployee(req);
  const date = dayStart();
  let attendance = await Attendance.findOne({ organizationId: req.auth!.organizationId, employeeId: employee._id, date });
  if (attendance?.clockIn && !attendance.clockOut) throw new ApiError(409, "You are already clocked in.", "ALREADY_CLOCKED_IN");
  if (!attendance) attendance = await Attendance.create({ organizationId: req.auth!.organizationId, employeeId: employee._id, date, status: "present", source: "web" });
  attendance.clockIn = new Date();
  attendance.status = "present";
  await attendance.save();
  await audit(req, "clocked_in", "Attendance", String(attendance._id));
  res.json({ success: true, data: attendance });
}
export async function clockOut(req: Request, res: Response) {
  const employee = await currentEmployee(req);
  const attendance = await Attendance.findOne({ organizationId: req.auth!.organizationId, employeeId: employee._id, date: dayStart() });
  if (!attendance?.clockIn) throw new ApiError(409, "You have not clocked in today.", "NOT_CLOCKED_IN");
  if (attendance.clockOut) throw new ApiError(409, "You are already clocked out.", "ALREADY_CLOCKED_OUT");
  attendance.clockOut = new Date();
  attendance.totalMinutes = Math.max(0, Math.round((attendance.clockOut.getTime() - attendance.clockIn.getTime()) / 60000));
  await attendance.save();
  await audit(req, "clocked_out", "Attendance", String(attendance._id));
  res.json({ success: true, data: attendance });
}
export async function list(req: Request, res: Response) {
  const from = req.query.from ? new Date(String(req.query.from)) : dayStart(new Date(new Date().setDate(new Date().getDate() - 30)));
  const to = req.query.to ? new Date(String(req.query.to)) : new Date();
  const filter: any = { organizationId: req.auth!.organizationId, date: { $gte: from, $lte: to } };
  if (req.query.employeeId) filter.employeeId = req.query.employeeId;
  const items = await Attendance.find(filter).populate("employeeId").sort({ date: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function upsertAdmin(req: Request, res: Response) {
  const employee = await Employee.findOne({ _id: req.body.employeeId, organizationId: req.auth!.organizationId });
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  const date = dayStart(new Date(req.body.date));
  const item = await Attendance.findOneAndUpdate(
    { organizationId: req.auth!.organizationId, employeeId: employee._id, date },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  );
  await audit(req, "managed", "Attendance", String(item._id));
  res.json({ success: true, data: item });
}
