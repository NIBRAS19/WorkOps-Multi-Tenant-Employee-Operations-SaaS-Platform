import type { ReactNode } from 'react'

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="section-title-row"><h2>{title}</h2>{action}</div>
}
