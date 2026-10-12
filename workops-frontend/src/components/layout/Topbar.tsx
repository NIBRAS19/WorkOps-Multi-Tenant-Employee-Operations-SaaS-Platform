import { Bell, ChevronDown, Command, Menu, Plus, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Topbar({ onMenu, onCommandPalette, onQuickCreate }: { onMenu: () => void; onCommandPalette: () => void; onQuickCreate: () => void }) {
  return <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-only" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button><button className="global-search" onClick={onCommandPalette}><Search size={17} /><span>Search employees, tasks, documents…</span><kbd><Command size={12} />K</kbd></button></div><div className="topbar-actions"><button className="quick-add-button" onClick={onQuickCreate}><Plus size={17} /> <span>Quick add</span></button><Link className="notification-button" to="/app/notifications"><Bell size={19} /><span className="notif-dot">3</span></Link><button className="profile-button"><span className="avatar avatar-sm">N</span><span className="profile-meta"><strong>Nibras</strong><small>Owner</small></span><ChevronDown size={15} /></button></div></header>
}
