import { Megaphone, Plus } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { announcements } from '../data/mockData'

export function Announcements() {
  const [open, setOpen] = useState(false)
  return <div className="page-stack"><PageHeader eyebrow="COMMUNICATION" title="Announcements" description="Keep your team informed with clear, time-bound updates." actions={<Button icon={<Plus size={16} />} onClick={() => setOpen(true)}>New announcement</Button>} /><div className="announcement-list">{announcements.map(a => <Card key={a.id} className="announcement-card"><div className="announcement-icon"><Megaphone size={19} /></div><div className="announcement-main"><div className="announcement-top"><Badge tone="blue">{a.category}</Badge><span>{a.date}</span></div><h3>{a.title}</h3><p>Published to <strong>{a.audience}</strong>. Employees can view this update from their dashboard and notifications.</p><div className="announcement-footer"><span>{a.id}</span><Badge tone="green" dot>{a.status}</Badge></div></div></Card>)}</div><Modal open={open} onClose={() => setOpen(false)} title="New announcement" description="Share a clear update with your team." size="md"><form className="form-stack" onSubmit={e => { e.preventDefault(); setOpen(false) }}><label>Title<input placeholder="Office Closure — National Holiday" /></label><label>Message<textarea rows={6} placeholder="Write your announcement…" /></label><div className="two-col"><label>Audience<select defaultValue="All employees"><option>All employees</option><option>Engineering</option><option>Design</option><option>Operations</option></select></label><label>Expires<input type="date" /></label></div><div className="modal-footer"><Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Publish announcement</Button></div></form></Modal></div>
}
