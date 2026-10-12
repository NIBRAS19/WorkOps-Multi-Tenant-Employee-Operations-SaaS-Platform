# WorkOps Frontend

A production-style React + TypeScript + Vite frontend prototype for the Employee Operations SaaS PRD.

## Included

- Public landing page
- Login / register flows
- Responsive app shell
- Dashboard
- Employees + employee profile
- Attendance
- Leave + approvals
- Tasks (board/list)
- Requests
- Documents
- Assets
- Announcements
- Calendar
- Reports
- Notifications
- Audit logs
- Help & support
- Settings with organization, users/roles, attendance, leave, notifications and security views
- Command palette (`Ctrl/Cmd + K`)
- Quick-add modal
- Light/dark theme toggle
- Mock data only; no paid AI API or backend required

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Backend integration

Set `VITE_API_BASE_URL` in `.env` when the Express/MongoDB backend is ready. Replace mock data modules with TanStack Query/API services as the backend is implemented.
