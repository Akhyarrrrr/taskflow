import { Priority } from '@/types'

export const priorityConfig: Record<
  Priority,
  { label: string; color: string; bg: string; ring: string }
> = {
  low: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-400/10', ring: 'ring-emerald-500/30' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10', ring: 'ring-amber-500/30' },
  high: { label: 'High', color: 'text-red-400', bg: 'bg-red-400/10', ring: 'ring-red-500/30' },
}
