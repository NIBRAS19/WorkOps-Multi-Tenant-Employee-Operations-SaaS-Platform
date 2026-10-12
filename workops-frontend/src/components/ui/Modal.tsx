import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ open, title, description, children, onClose, size = 'md' }: { open: boolean; title: string; description?: string; children: ReactNode; onClose: () => void; size?: 'sm' | 'md' | 'lg' }) {
  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><div className={`modal modal-${size}`} role="dialog" aria-modal="true"><div className="modal-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div><div className="modal-content">{children}</div></div></div>
}
