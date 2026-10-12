import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', icon, loading, children, className = '', disabled, ...props }: ButtonProps) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} disabled={disabled || loading} {...props}>{loading ? 'Working…' : icon}{children}</button>
}
