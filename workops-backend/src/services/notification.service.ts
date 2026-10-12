import { Notification } from "../models/Notification.js";

export async function createNotification(input: {
  organizationId: string;
  userId: string;
  type: string;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
}) {
  return Notification.create(input);
}
