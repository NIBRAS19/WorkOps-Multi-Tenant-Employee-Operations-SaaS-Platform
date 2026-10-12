export type Status = 'Active' | 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'In Progress' | 'Draft' | 'Inactive' | 'Present' | 'Late' | 'Remote' | 'Absent'

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  department: string
  team: string
  manager: string
  status: 'Active' | 'Inactive'
  joined: string
  location: string
  workMode: 'Office' | 'Hybrid' | 'Remote'
}

export const employees: Employee[] = [
  { id: 'EMP-0042', name: 'Sarah Ahmed', email: 'sarah.ahmed@acme.test', role: 'Senior Designer', department: 'Design', team: 'Product Design', manager: 'Nibras', status: 'Active', joined: '12 Mar 2026', location: 'Dubai', workMode: 'Hybrid' },
  { id: 'EMP-0041', name: 'Omar Khalid', email: 'omar.khalid@acme.test', role: 'Backend Engineer', department: 'Engineering', team: 'Platform', manager: 'Nibras', status: 'Active', joined: '02 Feb 2026', location: 'Abu Dhabi', workMode: 'Remote' },
  { id: 'EMP-0040', name: 'Aisha Rahman', email: 'aisha.rahman@acme.test', role: 'People Operations', department: 'Operations', team: 'People Ops', manager: 'Mariam', status: 'Active', joined: '20 Jan 2026', location: 'Dubai', workMode: 'Office' },
  { id: 'EMP-0039', name: 'Youssef Ali', email: 'youssef.ali@acme.test', role: 'Account Manager', department: 'Sales', team: 'Enterprise', manager: 'Mariam', status: 'Active', joined: '16 Dec 2025', location: 'Sharjah', workMode: 'Hybrid' },
  { id: 'EMP-0038', name: 'Mariam Hassan', email: 'mariam.hassan@acme.test', role: 'Operations Lead', department: 'Operations', team: 'People Ops', manager: 'CEO', status: 'Active', joined: '03 Nov 2025', location: 'Dubai', workMode: 'Office' },
  { id: 'EMP-0037', name: 'Daniel Paul', email: 'daniel.paul@acme.test', role: 'Frontend Engineer', department: 'Engineering', team: 'Web', manager: 'Nibras', status: 'Inactive', joined: '08 Aug 2025', location: 'Abu Dhabi', workMode: 'Remote' },
]

export const leaveRequests = [
  { id: 'LV-0192', employee: 'Sarah Ahmed', type: 'Annual Leave', range: 'Sep 21 – Sep 23, 2026', days: 3, status: 'Pending' as Status, submitted: '2h ago' },
  { id: 'LV-0191', employee: 'Omar Khalid', type: 'Sick Leave', range: 'Sep 18, 2026', days: 1, status: 'Approved' as Status, submitted: 'Yesterday' },
  { id: 'LV-0190', employee: 'Aisha Rahman', type: 'Personal Leave', range: 'Sep 25, 2026', days: 1, status: 'Pending' as Status, submitted: 'Yesterday' },
  { id: 'LV-0189', employee: 'Youssef Ali', type: 'Annual Leave', range: 'Oct 03 – Oct 07, 2026', days: 5, status: 'Rejected' as Status, submitted: 'Sep 17' },
]

export const tasks = [
  { id: 'TASK-701', title: 'Complete employee onboarding package', assignee: 'Aisha Rahman', due: 'Today', priority: 'High', status: 'In Progress' as Status },
  { id: 'TASK-702', title: 'Review leave requests', assignee: 'Nibras', due: 'Today', priority: 'High', status: 'Pending' as Status },
  { id: 'TASK-703', title: 'Upload Q4 policy documents', assignee: 'Mariam Hassan', due: 'Tomorrow', priority: 'Medium', status: 'Pending' as Status },
  { id: 'TASK-704', title: 'Audit laptop assignments', assignee: 'Omar Khalid', due: 'Sep 22', priority: 'Low', status: 'Completed' as Status },
  { id: 'TASK-705', title: 'Prepare department report', assignee: 'Youssef Ali', due: 'Sep 24', priority: 'Medium', status: 'Draft' as Status },
]

export const requests = [
  { id: 'REQ-921', title: 'Laptop replacement', employee: 'Ahmed Noor', category: 'Equipment', priority: 'Medium', status: 'Pending' as Status, updated: '10 min ago' },
  { id: 'REQ-920', title: 'Work from home — Sep 22', employee: 'Sarah Ahmed', category: 'Work From Home', priority: 'Low', status: 'Approved' as Status, updated: '1h ago' },
  { id: 'REQ-919', title: 'Employment confirmation letter', employee: 'Omar Khalid', category: 'Document', priority: 'Medium', status: 'In Progress' as Status, updated: '2h ago' },
  { id: 'REQ-918', title: 'Building access card', employee: 'Aisha Rahman', category: 'Access', priority: 'High', status: 'Completed' as Status, updated: 'Yesterday' },
]

export const documents = [
  { id: 'DOC-120', name: 'Employee Handbook.pdf', category: 'Policy', visibility: 'Company', updated: 'Sep 18, 2026', version: 'v3' },
  { id: 'DOC-119', name: 'Remote Work Policy.pdf', category: 'Policy', visibility: 'Company', updated: 'Sep 15, 2026', version: 'v2' },
  { id: 'DOC-118', name: 'Sarah Ahmed — Employment Contract.pdf', category: 'Contract', visibility: 'Private', updated: 'Sep 14, 2026', version: 'v1' },
  { id: 'DOC-117', name: 'Engineering Onboarding Checklist.pdf', category: 'Template', visibility: 'Company', updated: 'Sep 11, 2026', version: 'v5' },
]

export const assets = [
  { id: 'AST-2001', name: 'MacBook Pro 14”', type: 'Laptop', assignedTo: 'Sarah Ahmed', serial: 'MBP-88A1', status: 'Assigned' as const },
  { id: 'AST-2002', name: 'Dell UltraSharp 27”', type: 'Monitor', assignedTo: 'Omar Khalid', serial: 'MON-17F9', status: 'Assigned' as const },
  { id: 'AST-2003', name: 'iPhone 16', type: 'Phone', assignedTo: 'Aisha Rahman', serial: 'IPH-91K2', status: 'Assigned' as const },
  { id: 'AST-2004', name: 'ThinkPad T16', type: 'Laptop', assignedTo: '—', serial: 'TP-41CC', status: 'Available' as const },
]

export const announcements = [
  { id: 'ANN-31', title: 'Office Closure — National Holiday', audience: 'All employees', date: 'Sep 18, 2026', category: 'Operations', status: 'Published' },
  { id: 'ANN-30', title: 'Q4 Benefits Enrollment Opens', audience: 'All employees', date: 'Sep 15, 2026', category: 'People', status: 'Published' },
  { id: 'ANN-29', title: 'Engineering Town Hall — Friday', audience: 'Engineering', date: 'Sep 14, 2026', category: 'Engineering', status: 'Published' },
]

export const notifications = [
  { id: 'N-1', title: 'Sarah approved your leave request', time: '2 minutes ago', unread: true, type: 'Leave' },
  { id: 'N-2', title: 'New task assigned: Review leave requests', time: '18 minutes ago', unread: true, type: 'Task' },
  { id: 'N-3', title: 'Employee Handbook.pdf was updated', time: '1 hour ago', unread: true, type: 'Document' },
  { id: 'N-4', title: 'Omar completed “Audit laptop assignments”', time: 'Yesterday', unread: false, type: 'Task' },
  { id: 'N-5', title: 'Office Closure announcement published', time: 'Yesterday', unread: false, type: 'Announcement' },
]

export const activities = [
  { text: 'Sarah submitted an annual leave request', time: '09:42' },
  { text: 'Omar uploaded his employment document', time: '09:31' },
  { text: 'Aisha was added to People Ops team', time: '09:14' },
  { text: 'Ahmed completed asset handover', time: '08:54' },
]

export const departmentCards = [
  { name: 'Engineering', count: 24, lead: 'Nibras', tone: 'blue' },
  { name: 'Design', count: 12, lead: 'Sarah', tone: 'violet' },
  { name: 'Sales', count: 31, lead: 'Mariam', tone: 'amber' },
  { name: 'Operations', count: 18, lead: 'Mariam', tone: 'green' },
]

export const reportMetrics = [
  { label: 'Headcount', value: '128', change: '+8.4%' },
  { label: 'Attendance rate', value: '94.2%', change: '+1.8%' },
  { label: 'Leave utilization', value: '38%', change: '-2.1%' },
  { label: 'Requests resolved', value: '91%', change: '+4.6%' },
]
