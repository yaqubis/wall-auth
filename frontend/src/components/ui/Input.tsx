import clsx from 'clsx'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
  hint?: string
}

export function Input({ label, icon, error, hint, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-stone-600 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          className={clsx(
            'w-full bg-white border border-junto-200 rounded-xl px-4 py-3.5',
            'text-ink placeholder-stone-400',
            'focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100 transition-all',
            icon && 'pl-11',
            error && 'border-red-300 focus:border-red-300 focus:ring-2 focus:ring-red-50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  )
}
