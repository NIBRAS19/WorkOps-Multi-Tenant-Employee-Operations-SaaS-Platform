import { Bell, CheckCheck, FileText, Megaphone, CalendarDays, CheckSquare } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { notifications as initialNotifications } from '../data/mockData'
import { useState } from 'react'

const iconFor = (type: string) => type === 'Leave' ? <CalendarDays size={17} /> : type === 'Task' ? <CheckSquare size={17} /> : type === 'Document' ? <FileText size={17} /> : <Megaphone size={17} />

export function Notifications() {
  const [items, setItems] = useState(initialNotifications)
  const unread = items.filter(i => i.unread).length
  return <div className="page-stack"><PageHeader eyebrow="INBOX" title="Notifications" description="Stay on top of approvals, tasks and workspace activity." actions={<Button variant="secondary" icon={<CheckCheck size={16} />} onClick={() => setItems(items.map(i => ({ ...i, unread: false })))}>Mark all as read</Button>} /><Card><div className="notification-list">{items.map(item => <button className={`notification-row ${item.unread ? 'unread' : ''}`} key={item.id} onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, unread: false } : i))}><span className="notification-icon">{iconFor(item.type)}</span><span className="notification-copy"><strong>{item.title}</strong><span>{item.time}</span></span>{item.unread && <i className="unread-dot" />}</button>)}{items.length === 0 && <div className="empty-inline"><Bell size={18} /> You're all caught up.</div>}</div><div className="notification-summary"><span>{unread} unread notifications</span><span>·</span><span>Showing latest activity</span></div></Card></div>
}
