import { NavLink } from 'react-router-dom'
import { BarChart3, Bell, BriefcaseBusiness, Building2, CalendarDays, CheckSquare, CircleHelp, ClipboardList, Clock3, FileText, FolderKanban, LayoutDashboard, Megaphone, Package, Settings, ShieldCheck, UsersRound, X } from 'lucide-react'
import type { ReactNode } from 'react'

const groups: { label: string; items: { label: string; path: string; icon: ReactNode }[] }[] = [
  { label: 'Workspace', items: [
    { label: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Employees', path: '/app/employees', icon: <UsersRound size={18} /> },
    { label: 'Attendance', path: '/app/attendance', icon: <Clock3 size={18} /> },
    { label: 'Leave', path: '/app/leave', icon: <CalendarDays size={18} /> },
    { label: 'Tasks', path: '/app/tasks', icon: <CheckSquare size={18} /> },
    { label: 'Requests', path: '/app/requests', icon: <ClipboardList size={18} /> },
  ]},
  { label: 'Resources', items: [
    { label: 'Documents', path: '/app/documents', icon: <FileText size={18} /> },
    { label: 'Assets', path: '/app/assets', icon: <Package size={18} /> },
    { label: 'Announcements', path: '/app/announcements', icon: <Megaphone size={18} /> },
    { label: 'Calendar', path: '/app/calendar', icon: <CalendarDays size={18} /> },
  ]},
  { label: 'Insights', items: [{ label: 'Reports', path: '/app/reports', icon: <BarChart3 size={18} /> }] },
  { label: 'Administration', items: [
    { label: 'Settings', path: '/app/settings', icon: <Settings size={18} /> },
    { label: 'Audit Logs', path: '/app/audit-logs', icon: <ShieldCheck size={18} /> },
  ]},
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="sidebar-head"><div className="brand-mark">W</div><div><div className="brand-name">WorkOps</div><div className="brand-sub">Employee operations</div></div><button className="icon-button mobile-only" onClick={onClose}><X size={18} /></button></div>
    <div className="workspace-switcher"><Building2 size={16} /><span>Acme Technologies</span><span className="workspace-caret">⌄</span></div>
    <nav className="sidebar-nav">{groups.map((group) => <div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div>{group.items.map((item) => <NavLink to={item.path} key={item.path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></NavLink>)}</div>)}</nav>
    <div className="sidebar-bottom"><NavLink to="/app/help" className="nav-item"><span className="nav-icon"><CircleHelp size={18} /></span>Help & Support</NavLink><div className="sidebar-footer-card"><div className="mini-avatar">N</div><div><strong>Nibras</strong><span>Owner</span></div><span className="status-dot" /></div></div>
  </aside>
}
