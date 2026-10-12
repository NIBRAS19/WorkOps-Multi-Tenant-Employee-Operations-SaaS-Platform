import type { Request, Response } from "express";
import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { Task } from "../models/Task.js";
import { Announcement } from "../models/Announcement.js";

export async function summary(req: Request, res: Response) {
  const org = req.auth!.organizationId;
  const [employees, present, onLeave, leavePending, requestsPending, tasksOpen, announcements] = await Promise.all([
    Employee.countDocuments({ organizationId: org, status: "active" }),
    Attendance.countDocuments({ organizationId: org, date: { $gte: new Date(new Date().setHours(0,0,0,0)), $lt: new Date(new Date().setHours(24,0,0,0)) }, status: { $in: ["present","remote","late"] } }),
    Employee.countDocuments({ organizationId: org, status: "on_leave" }),
    LeaveRequest.countDocuments({ organizationId: org, status: "pending" }),
    ServiceRequest.countDocuments({ organizationId: org, status: { $in: ["pending","assigned","in_progress","waiting"] } }),
    Task.countDocuments({ organizationId: org, status: { $ne: "completed" } }),
    Announcement.find({ organizationId: org }).sort({ publishAt: -1 }).limit(5).lean()
  ]);
  res.json({
    success: true,
    data: { employees, present, onLeave, leavePending, requestsPending, tasksOpen, announcements }
  });
}
