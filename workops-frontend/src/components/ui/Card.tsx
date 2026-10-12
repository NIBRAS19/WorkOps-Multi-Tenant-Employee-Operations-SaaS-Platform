import type { ReactNode } from 'react'

export function Card({ children, className = '', ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`card ${className}`} {...props}>{children}</div>
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="card-header"><div><h3 className="card-title">{title}</h3>{description && <p className="card-description">{description}</p>}</div>{action}</div>
}
