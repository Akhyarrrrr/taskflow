import { cn } from '@/lib/utils/cn'
import type { LucideIcon } from 'lucide-react'

interface StatPillProps {
  icon: LucideIcon
  label: string
  value: string | number
  tone?: 'default' | 'violet' | 'cyan' | 'amber' | 'teal'
}

const tones = {
  default: 'bg-white/5 text-zinc-300 border-white/10',
  violet: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  amber: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  teal: 'bg-teal-500/10 text-teal-300 border-teal-500/20',
}

export function StatPill({ icon: Icon, label, value, tone = 'default' }: StatPillProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3 py-2.5 sm:px-4 sm:py-3 min-w-0',
        tones[tone],
      )}
    >
      <Icon className="w-4 h-4 shrink-0 opacity-80" />
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs uppercase tracking-wider opacity-70 truncate">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-white tabular-nums truncate">{value}</p>
      </div>
    </div>
  )
}
