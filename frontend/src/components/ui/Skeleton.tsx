import clsx from 'clsx'

interface SkeletonProps {
  className?: string
  rounded?: boolean
}

export function Skeleton({ className, rounded }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-junto-100',
        rounded ? 'rounded-full' : 'rounded-2xl',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl overflow-hidden bg-junto-50 border border-junto-200 animate-pulse">
      <div className="h-3/4 bg-junto-100" />
      <div className="p-5 space-y-3">
        <div className="h-6 bg-junto-100 rounded-2xl w-2/3" />
        <div className="h-4 bg-junto-100 rounded-2xl w-full" />
        <div className="flex gap-2">
          <div className="h-6 bg-junto-100 rounded-full w-20" />
          <div className="h-6 bg-junto-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}
