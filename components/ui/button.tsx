'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 hover:from-teal-400 hover:to-teal-300 border border-white/20 active:scale-[0.98]',
  secondary:
    'bg-white/[0.06] text-zinc-100 border border-white/10 hover:bg-white/10 hover:border-white/15 active:scale-[0.98]',
  ghost: 'text-zinc-400 hover:text-white hover:bg-white/[0.06] active:scale-[0.98]',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/25 active:scale-[0.98]',
  outline: 'border border-white/15 text-zinc-200 hover:bg-white/[0.06] hover:border-white/25 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', loading, disabled, children, icon, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060a] disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="h-4 w-4 rounded-full skeleton-shimmer" aria-hidden /> : icon}
      {children}
    </button>
  )
})
