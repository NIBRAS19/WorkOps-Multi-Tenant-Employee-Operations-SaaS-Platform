import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { Dashboard } from './pages/Dashboard'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Employees } from './pages/Employees'
import { Attendance } from './pages/Attendance'
import { Leave } from './pages/Leave'
import { Tasks } from './pages/Tasks'
import { Requests } from './pages/Requests'
import { Documents } from './pages/Documents'
import { Assets } from './pages/Assets'
import { Announcements } from './pages/Announcements'
import { CalendarPage } from './pages/CalendarPage'
import { Reports } from './pages/Reports'
import { Notifications } from './pages/Notifications'
import { Settings } from './pages/settings/Settings'
import { AuditLogs } from './pages/AuditLogs'
import { Help } from './pages/Help'
import { EmployeeDetail } from './pages/EmployeeDetail'

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    <Route path="/app" element={<AppLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="employees" element={<Employees />} />
      <Route path="employees/:id" element={<EmployeeDetail />} />
      <Route path="attendance" element={<Attendance />} />
      <Route path="leave" element={<Leave />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="requests" element={<Requests />} />
      <Route path="documents" element={<Documents />} />
      <Route path="assets" element={<Assets />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="reports" element={<Reports />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
      <Route path="audit-logs" element={<AuditLogs />} />
      <Route path="help" element={<Help />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
}
