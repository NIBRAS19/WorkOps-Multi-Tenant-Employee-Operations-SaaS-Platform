import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

export function StatCard({ icon, label, value, change, positive = true }: { icon: ReactNode; label: string; value: string; change?: string; positive?: boolean }) {
  return <div className="stat-card"><div className="stat-top"><div className="stat-icon">{icon}</div>{change && <span className={`stat-change ${positive ? 'positive' : 'negative'}`}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span>}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div>
}
