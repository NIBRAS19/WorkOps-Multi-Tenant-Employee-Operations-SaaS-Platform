import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { Organization } from "./models/Organization.js";
import { User } from "./models/User.js";
import { Membership } from "./models/Membership.js";
import { Role } from "./models/Role.js";
import { Department } from "./models/Department.js";
import { Team } from "./models/Team.js";
import { Employee } from "./models/Employee.js";
import { LeavePolicy } from "./models/LeavePolicy.js";
import { Asset } from "./models/Asset.js";
import { Task } from "./models/Task.js";
import { rolePermissions } from "./utils/permissions.js";

async function seed() {
  await connectDatabase();

  const existing = await Organization.findOne({ slug: "workops-demo" });
  if (existing) {
    console.log("Demo workspace already exists.");
    process.exit(0);
  }

  const organization = await Organization.create({
    name: "WorkOps Demo",
    slug: "workops-demo",
    industry: "Professional Services",
    country: "AE",
    timezone: "Asia/Dubai",
    subscription: { plan: "growth", status: "active" }
  });

  const roles = await Role.insertMany(
    Object.entries(rolePermissions).map(([key, permissions]) => ({
      organizationId: organization._id,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      key,
      permissions,
      isSystem: true
    }))
  );

  const roleMap = new Map(roles.map((r) => [r.key, r]));
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await User.create({
    email: "admin@workops.local",
    passwordHash,
    firstName: "Nibras",
    lastName: "Admin",
    emailVerified: true
  });

  await Membership.create({
    organizationId: organization._id,
    userId: admin._id,
    role: "owner",
    roleId: roleMap.get("owner")?._id,
    status: "active",
    joinedAt: new Date()
  });

  const department = await Department.create({
    organizationId: organization._id,
    name: "Engineering",
    description: "Software engineering and platform team"
  });

  const team = await Team.create({
    organizationId: organization._id,
    departmentId: department._id,
    name: "Product Engineering",
    description: "Full-stack and platform engineering"
  });

  const employee = await Employee.create({
    organizationId: organization._id,
    userId: admin._id,
    employeeCode: "EMP-0001",
    firstName: "Nibras",
    lastName: "Admin",
    email: admin.email,
    jobTitle: "Founder / Administrator",
    departmentId: department._id,
    teamId: team._id,
    employmentType: "full_time",
    workMode: "hybrid",
    location: "Abu Dhabi",
    joiningDate: new Date(),
    status: "active"
  });

  department.headEmployeeId = employee._id;
  await department.save();

  await Membership.findOneAndUpdate(
    { organizationId: organization._id, userId: admin._id },
    { $set: { employeeId: employee._id } }
  );

  await LeavePolicy.insertMany([
    { organizationId: organization._id, name: "Annual Leave", code: "ANNUAL", annualAllowance: 24, carryForward: true, approvalRequired: true },
    { organizationId: organization._id, name: "Sick Leave", code: "SICK", annualAllowance: 10, carryForward: false, approvalRequired: true },
    { organizationId: organization._id, name: "Personal Leave", code: "PERSONAL", annualAllowance: 3, carryForward: false, approvalRequired: true }
  ]);

  await Asset.insertMany([
    { organizationId: organization._id, name: "MacBook Pro 14", type: "Laptop", serialNumber: "WO-MBP-001", status: "assigned", assignedTo: employee._id, assignedAt: new Date(), condition: "Excellent" },
    { organizationId: organization._id, name: "Dell 27 Monitor", type: "Monitor", serialNumber: "WO-MON-001", status: "available", condition: "Good" }
  ]);

  await Task.create({
    organizationId: organization._id,
    title: "Complete WorkOps workspace setup",
    description: "Configure the demo workspace and validate employee operations workflows.",
    assigneeId: employee._id,
    reporterId: employee._id,
    priority: "high",
    status: "in_progress",
    dueDate: new Date(Date.now() + 86400000)
  });

  console.log(`
WorkOps demo seeded.

Email: admin@workops.local
Password: Admin@12345
Organization: ${organization._id}
`);
  await import("./sqlite/index.js").then(({ closeDatabase }) => closeDatabase());
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
