import clsx from 'clsx'
import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'verified' | 'online' | 'new' | 'premium'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const base = 'inline-flex items-center gap-1 rounded-full font-medium'

  const variants = {
    default:  'bg-junto-100 text-stone-600 border border-junto-200',
    verified: 'bg-sage-50 text-sage-600 border border-sage-200',
    online:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    new:      'bg-terra-500 text-white',
    premium:  'bg-amber-50 text-amber-700 border border-amber-200',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span className={clsx(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}
