import { ChevronLeft, ChevronRight, Clock3 } from 'lucide-react'
import { Card, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

const events = [
  { day: 19, title: 'Engineering standup', time: '10:00', type: 'Meeting' },
  { day: 21, title: 'Sarah Ahmed — Annual Leave', time: 'All day', type: 'Leave' },
  { day: 23, title: 'Engineering Town Hall', time: '14:00', type: 'Event' },
  { day: 25, title: 'Q4 benefits deadline', time: 'All day', type: 'Deadline' },
]

export function CalendarPage() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1)
  const offset = 2
  return <div className="page-stack"><PageHeader eyebrow="SCHEDULE" title="Calendar" description="See leave, meetings, deadlines and team events in one view." actions={<div className="segmented"><button className="active">Month</button><button>Week</button><button>Agenda</button></div>} /><Card><div className="calendar-header"><button><ChevronLeft size={17} /></button><div><strong>September 2026</strong><span>All workspace events</span></div><button><ChevronRight size={17} /></button></div><div className="calendar-weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}</div><div className="calendar-grid">{Array.from({ length: offset }).map((_, i) => <div className="calendar-cell empty" key={`e-${i}`} />)}{days.map(day => <div className={`calendar-cell ${day === 19 ? 'today' : ''}`} key={day}><span className="calendar-date">{day}</span>{events.filter(e => e.day === day).map(e => <div className="calendar-event" key={e.title}><span>{e.time}</span><strong>{e.title}</strong><Badge tone={e.type === 'Leave' ? 'green' : e.type === 'Deadline' ? 'amber' : 'blue'}>{e.type}</Badge></div>)}</div>)}</div></Card><Card><CardHeader title="Upcoming schedule" /><div className="upcoming-list">{events.map(e => <div key={e.title}><span className="upcoming-date"><b>{e.day}</b><small>SEP</small></span><div><strong>{e.title}</strong><span><Clock3 size={13} /> {e.time}</span></div></div>)}</div></Card></div>
}
