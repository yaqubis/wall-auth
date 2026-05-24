import clsx from 'clsx'

interface AvatarProps {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  className?: string
}

const sizes = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl',
}

const dots = {
  xs: 'w-2 h-2',
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
  xl: 'w-5 h-5',
}

export function Avatar({ src, name, size = 'md', online, className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={clsx('relative flex-shrink-0', className)}>
      <div className={clsx('rounded-full overflow-hidden ring-2 ring-junto-200', sizes[size])}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-sage-gradient flex items-center justify-center font-semibold text-white">
            {initials}
          </div>
        )}
      </div>
      {online && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full bg-sage-400 border-2 border-white',
            dots[size]
          )}
        />
      )}
    </div>
  )
}
