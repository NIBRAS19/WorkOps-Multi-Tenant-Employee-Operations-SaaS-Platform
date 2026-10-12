import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Download, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'

const rows = [
  ['Sarah Ahmed', '08:42', '17:21', '08h 39m', 'Present'],
  ['Omar Khalid', '09:07', '17:35', '08h 28m', 'Late'],
  ['Aisha Rahman', '08:51', '—', '04h 18m', 'Present'],
  ['Youssef Ali', '—', '—', '—', 'Remote'],
  ['Mariam Hassan', '08:31', '17:10', '08h 39m', 'Present'],
]

export function Attendance() {
  const [clocked, setClocked] = useState(false)
  return <div className="page-stack"><PageHeader eyebrow="TIME & ATTENDANCE" title="Attendance" description="Track working hours and attendance in one place." actions={<Button variant="secondary" icon={<Download size={16} />}>Export</Button>} /><div className="attendance-top-grid"><Card className="clock-card"><div className="page-eyebrow">MY ATTENDANCE · TODAY</div><div className="clock-time">{clocked ? '08:42 AM' : '—'}</div><p>{clocked ? 'You are currently checked in.' : 'You are currently checked out.'}</p><div className="clock-meta"><span><Clock3 size={15} /> Worked {clocked ? '04h 18m' : '00h 00m'}</span><span><MapPin size={15} /> Office</span></div><Button className="clock-button" onClick={() => setClocked(v => !v)} icon={<Clock3 size={16} />}>{clocked ? 'Clock out' : 'Clock in'}</Button></Card><Card><CardHeader title="Today’s overview" description="Company-wide attendance" /><div className="attendance-kpis"><div><strong>104</strong><span>Present</span></div><div><strong>8</strong><span>Late</span></div><div><strong>11</strong><span>Remote</span></div><div><strong>5</strong><span>Absent</span></div></div><div className="attendance-progress"><div className="attendance-segment green" style={{ width: '81%' }} /><div className="attendance-segment amber" style={{ width: '6%' }} /><div className="attendance-segment blue" style={{ width: '9%' }} /><div className="attendance-segment red" style={{ width: '4%' }} /></div></Card></div><Card><div className="attendance-toolbar"><div><div className="calendar-switch"><button><ChevronLeft size={16} /></button><strong>September 19, 2026</strong><button><ChevronRight size={16} /></button></div><span className="muted">Today · Saturday</span></div><div className="toolbar-actions"><Button variant="secondary" icon={<CalendarDays size={16} />}>Calendar view</Button></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Employee</th><th>Check in</th><th>Check out</th><th>Total</th><th>Status</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}><td><strong>{r[0]}</strong></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td><Badge tone={r[4] === 'Present' ? 'green' : r[4] === 'Late' ? 'amber' : r[4] === 'Remote' ? 'blue' : 'red'} dot>{r[4]}</Badge></td></tr>)}</tbody></table></div></Card></div>
}
