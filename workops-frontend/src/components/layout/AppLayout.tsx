import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Command, LogOut, Plus, Search, UserRound } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const [dark, setDark] = useLocalStorage('workops-theme', false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(true)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setQuickOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commandItems = [
    { label: 'Open dashboard', path: '/app/dashboard' },
    { label: 'Add employee', path: '/app/employees?create=1' },
    { label: 'Request leave', path: '/app/leave?create=1' },
    { label: 'Create task', path: '/app/tasks?create=1' },
    { label: 'Upload document', path: '/app/documents?upload=1' },
    { label: 'Open settings', path: '/app/settings' },
  ]

  return <div className="app-shell">
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}
    <div className="app-main"><Topbar onMenu={() => setSidebarOpen(true)} onCommandPalette={() => setPaletteOpen(true)} onQuickCreate={() => setQuickOpen(true)} /><main className="page-content"><Outlet /></main></div>

    <Modal open={paletteOpen} onClose={() => setPaletteOpen(false)} title="Quick command" description="Jump anywhere in WorkOps." size="sm">
      <div className="command-input"><Search size={17} /><input autoFocus placeholder="Search commands…" /></div>
      <div className="command-list">{commandItems.map(item => <button key={item.path} className="command-item" onClick={() => { setPaletteOpen(false); navigate(item.path) }}><span><Command size={15} />{item.label}</span><kbd>↵</kbd></button>)}</div>
    </Modal>

    <Modal open={quickOpen} onClose={() => setQuickOpen(false)} title="Quick add" description="Create something without leaving your current page." size="sm">
      <div className="quick-grid"><button className="quick-create-card" onClick={() => { setQuickOpen(false); navigate('/app/employees?create=1') }}><UserRound size={19} /><strong>Employee</strong><span>Add a team member</span></button><button className="quick-create-card" onClick={() => { setQuickOpen(false); navigate('/app/tasks?create=1') }}><Plus size={19} /><strong>Task</strong><span>Create work for your team</span></button><button className="quick-create-card" onClick={() => { setQuickOpen(false); navigate('/app/leave?create=1') }}><Command size={19} /><strong>Leave request</strong><span>Submit time off</span></button><button className="quick-create-card" onClick={() => { setQuickOpen(false); navigate('/app/documents?upload=1') }}><Search size={19} /><strong>Document</strong><span>Upload a file</span></button></div>
      <div className="modal-footer"><label className="switch-row"><span>Dark mode</span><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /></label><Button variant="ghost" onClick={() => setQuickOpen(false)}><LogOut size={15} /> Close</Button></div>
    </Modal>
  </div>
}
