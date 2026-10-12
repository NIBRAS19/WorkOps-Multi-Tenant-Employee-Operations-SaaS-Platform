import type { Request, Response } from "express";
import fs from "node:fs";
import { Document } from "../models/Document.js";
import { DocumentVersion } from "../models/DocumentVersion.js";
import { ApiError } from "../utils/apiError.js";
import { audit } from "../services/audit.service.js";

export async function list(req: Request, res: Response) {
  const filter: any = { organizationId: req.auth!.organizationId, status: { $ne: "archived" } };
  if (req.query.category) filter.category = req.query.category;
  const items = await Document.find(filter).populate("currentVersionId createdBy").sort({ updatedAt: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function upload(req: Request, res: Response) {
  if (!req.file) throw new ApiError(422, "A file is required.", "FILE_REQUIRED");
  const doc = await Document.create({
    organizationId: req.auth!.organizationId,
    name: req.body.name ?? req.file.originalname,
    category: req.body.category ?? "other",
    visibility: req.body.visibility ?? "private",
    ownerType: req.body.ownerType ?? "organization",
    ownerId: req.body.ownerId,
    createdBy: req.auth!.userId
  });
  const version = await DocumentVersion.create({
    organizationId: req.auth!.organizationId,
    documentId: doc._id,
    version: 1,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    storagePath: req.file.path,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.auth!.userId,
    changeNote: "Initial upload"
  });
  doc.currentVersionId = version._id;
  await doc.save();
  await audit(req, "uploaded", "Document", String(doc._id));
  res.status(201).json({ success: true, data: await Document.findById(doc._id).populate("currentVersionId").lean() });
}
export async function get(req: Request, res: Response) {
  const doc = await Document.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId }).populate("currentVersionId createdBy").lean();
  if (!doc) throw new ApiError(404, "Document not found.", "DOCUMENT_NOT_FOUND");
  res.json({ success: true, data: doc });
}
export async function download(req: Request, res: Response) {
  const doc = await Document.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId }).populate("currentVersionId");
  if (!doc) throw new ApiError(404, "Document not found.", "DOCUMENT_NOT_FOUND");
  const version = doc.currentVersionId as any;
  if (!version?.storagePath || !fs.existsSync(version.storagePath)) throw new ApiError(404, "Document file is missing.", "FILE_NOT_FOUND");
  await audit(req, "downloaded", "Document", String(doc._id));
  res.download(version.storagePath, version.originalName ?? version.fileName);
}
export async function versions(req: Request, res: Response) {
  const doc = await Document.findOne({ _id: req.params.id, organizationId: req.auth!.organizationId }).lean();
  if (!doc) throw new ApiError(404, "Document not found.", "DOCUMENT_NOT_FOUND");
  const items = await DocumentVersion.find({ organizationId: req.auth!.organizationId, documentId: doc._id }).populate("uploadedBy").sort({ version: -1 }).lean();
  res.json({ success: true, data: items });
}
export async function archive(req: Request, res: Response) {
  const doc = await Document.findOneAndUpdate({ _id: req.params.id, organizationId: req.auth!.organizationId }, { $set: { status: "archived" } }, { new: true });
  if (!doc) throw new ApiError(404, "Document not found.", "DOCUMENT_NOT_FOUND");
  await audit(req, "archived", "Document", String(doc._id));
  res.json({ success: true, data: null });
}
