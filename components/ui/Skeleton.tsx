import { cn } from '@/lib/utils/cn'

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={cn('rounded-xl skeleton-shimmer', className)} aria-hidden />
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#06060a]">
      <div className="border-b border-white/[0.06] h-16 px-6 flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-36 rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="min-h-screen bg-[#06060a]">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="h-24 px-4 flex items-center gap-3 border-b border-white/[0.06]">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
      </div>
      <div className="flex gap-4 p-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[420px] w-72 shrink-0 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}
