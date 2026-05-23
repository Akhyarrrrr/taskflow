import { cn } from '@/lib/utils/cn'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6 sm:p-8' }

export function GlassCard({ className, children, glow, padding = 'md', ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl',
        'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
        glow && 'before:absolute before:inset-0 before:rounded-2xl before:p-px before:bg-gradient-to-br before:from-violet-500/20 before:via-transparent before:to-cyan-500/20 before:-z-10',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
