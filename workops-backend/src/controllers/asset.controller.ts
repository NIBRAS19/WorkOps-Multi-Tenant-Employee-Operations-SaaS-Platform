import type { Request, Response } from "express";
import { Asset } from "../models/Asset.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";
import { createNotification } from "../services/notification.service.js";

export async function list(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId };
  if (req.query.status) filter.status = req.query.status;
  const items = await Asset.find(filter).populate("assignedTo").sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function create(req: Request, res: Response) {
  const item = await Asset.create({ ...req.body, organizationId: req.auth!.organizationId });
  await audit(req, "created", "Asset", String(item._id));
  res.status(201).json({ success: true, data: item });
}
export async function update(req: Request, res: Response) {
  const item = await Asset.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, req.body, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, "Asset not found.", "ASSET_NOT_FOUND");
  await audit(req, "updated", "Asset", String(item._id));
  res.json({ success: true, data: item });
}
export async function assign(req: Request, res: Response) {
  const asset = await Asset.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!asset) throw new ApiError(404, "Asset not found.", "ASSET_NOT_FOUND");
  const employee = await Employee.findOne({ _id: req.body.employeeId, organizationId: req.auth!.organizationId });
  if (!employee) throw new ApiError(404, "Employee not found.", "EMPLOYEE_NOT_FOUND");
  asset.assignedTo = employee._id;
  asset.assignedAt = new Date();
  asset.status = "assigned";
  asset.condition = req.body.condition ?? asset.condition;
  await asset.save();
  if (employee.userId) {
    await createNotification({
      organizationId: req.auth!.organizationId,
      userId: String(employee.userId),
      type: "asset",
      title: "Asset assigned",
      body: `${asset.name} was assigned to you.`,
      data: { assetId: String(asset._id) }
    });
  }
  await audit(req, "assigned", "Asset", String(asset._id), { employeeId: String(employee._id) });
  res.json({ success: true, data: asset });
}
export async function returnAsset(req: Request, res: Response) {
  const asset = await Asset.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId });
  if (!asset) throw new ApiError(404, "Asset not found.", "ASSET_NOT_FOUND");
  asset.assignedTo = null as any;
  asset.assignedAt = null as any;
  asset.status = "available";
  await asset.save();
  await audit(req, "returned", "Asset", String(asset._id));
  res.json({ success: true, data: asset });
}
