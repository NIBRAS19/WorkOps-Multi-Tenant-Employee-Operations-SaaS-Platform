import type { Request, Response } from "express";
import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { Task } from "../models/Task.js";
import { ServiceRequest } from "../models/ServiceRequest.js";

export async function overview(req: Request, res: Response) {
  const org = req.auth!.organizationId;
  const [employees, attendance, leave, tasks, requests] = await Promise.all([
    Employee.aggregate([{ $match: { organizationId: org as any } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Attendance.aggregate([{ $match: { organizationId: org as any } }, { $group: { _id: "$status", count: { $sum: 1 }, totalMinutes: { $sum: "$totalMinutes" } } }]),
    LeaveRequest.aggregate([{ $match: { organizationId: org as any } }, { $group: { _id: "$status", count: { $sum: 1 }, days: { $sum: "$days" } } }]),
    Task.aggregate([{ $match: { organizationId: org as any } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    ServiceRequest.aggregate([{ $match: { organizationId: org as any } }, { $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);
  res.json({ success: true, data: { employees, attendance, leave, tasks, requests } });
}

export async function attendance(req: Request, res: Response) {
  const org = req.auth!.organizationId;
  const data = await Attendance.aggregate([
    { $match: { organizationId: org as any } },
    { $group: { _id: { day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, status: "$status" }, count: { $sum: 1 }, minutes: { $sum: "$totalMinutes" } } },
    { $sort: { "_id.day": 1 } }
  ]);
  res.json({ success: true, data });
}
export async function leave(req: Request, res: Response) {
  const data = await LeaveRequest.aggregate([
    { $match: { organizationId: req.auth!.organizationId as any } },
    { $group: { _id: "$status", count: { $sum: 1 }, days: { $sum: "$days" } } }
  ]);
  res.json({ success: true, data });
}
