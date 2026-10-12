export const roleNames = ["owner", "admin", "manager", "employee"] as const;
export type RoleName = typeof roleNames[number];

export const permissionKeys = [
  "employee.read",
  "employee.create",
  "employee.update",
  "employee.delete",
  "attendance.read",
  "attendance.manage",
  "leave.read",
  "leave.create",
  "leave.approve",
  "leave.manage",
  "task.read",
  "task.create",
  "task.update",
  "task.delete",
  "request.read",
  "request.create",
  "request.manage",
  "document.read",
  "document.upload",
  "document.manage",
  "asset.read",
  "asset.manage",
  "announcement.read",
  "announcement.manage",
  "calendar.read",
  "calendar.manage",
  "report.read",
  "audit.read",
  "settings.read",
  "settings.manage",
  "user.manage"
] as const;
export type PermissionKey = typeof permissionKeys[number];

export const rolePermissions: Record<RoleName, PermissionKey[]> = {
  owner: [...permissionKeys],
  admin: [...permissionKeys].filter((p) => p !== "audit.read" ? true : true),
  manager: [
    "employee.read", "attendance.read", "leave.read", "leave.approve",
    "task.read", "task.create", "task.update",
    "request.read", "request.create", "request.manage",
    "document.read", "document.upload",
    "asset.read",
    "announcement.read", "announcement.manage",
    "calendar.read", "calendar.manage",
    "report.read"
  ],
  employee: [
    "employee.read", "attendance.read",
    "leave.read", "leave.create",
    "task.read", "task.update",
    "request.read", "request.create",
    "document.read", "document.upload",
    "asset.read",
    "announcement.read",
    "calendar.read"
  ]
};

export function hasPermission(role: RoleName, permission: PermissionKey): boolean {
  return rolePermissions[role].includes(permission);
}
