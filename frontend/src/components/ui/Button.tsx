import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sage'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: ReactNode
  fullWidth?: boolean
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth,
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none select-none'

  const variants = {
    primary:   'bg-terra-gradient text-white shadow-button hover:opacity-90',
    secondary: 'bg-white border border-junto-200 text-ink hover:bg-junto-50',
    ghost:     'text-sage-600 hover:bg-sage-50',
    danger:    'bg-white border border-red-200 text-red-600 hover:bg-red-50',
    sage:      'bg-sage-gradient text-white shadow-sage-button hover:opacity-90',
  }

  const sizes = {
    sm: 'px-3.5 py-2 text-sm rounded-xl',
    md: 'px-5 py-3 text-sm rounded-2xl',
    lg: 'px-6 py-3.5 text-base rounded-2xl',
    xl: 'px-8 py-4 text-lg rounded-2xl',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  )
}
