import { forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, id, ...props },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border text-zinc-100 placeholder:text-zinc-600 text-sm transition',
          'focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50',
          error ? 'border-red-500/40' : 'border-white/10 hover:border-white/15',
          className,
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }>(
  function Textarea({ className, label, hint, id, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-100 placeholder:text-zinc-600 text-sm resize-none transition',
            'focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 hover:border-white/15',
            className,
          )}
          {...props}
        />
        {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      </div>
    )
  },
)
