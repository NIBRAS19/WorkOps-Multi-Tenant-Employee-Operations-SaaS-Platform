import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  tone?: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'violet'
  dot?: boolean
}

export function Badge({ children, tone = 'gray', dot = false }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{dot && <span className="badge-dot" />}{children}</span>
}
