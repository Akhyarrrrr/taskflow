'use client'

import { Toaster as Sonner } from 'sonner'
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-center"
      expand
      richColors
      closeButton
      icons={{
        success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
        error: <AlertCircle className="w-4 h-4 text-red-400" />,
        info: <Info className="w-4 h-4 text-cyan-400" />,
        warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group !bg-[#0f0f14]/95 !border !border-white/10 !backdrop-blur-xl !shadow-2xl !shadow-black/50 !rounded-xl !px-4 !py-3',
          title: '!text-zinc-100 !font-medium !text-sm',
          description: '!text-zinc-400 !text-xs !mt-0.5',
          actionButton: '!bg-violet-600 !text-white !rounded-lg',
          cancelButton: '!bg-white/5 !text-zinc-300 !rounded-lg',
          closeButton: '!bg-white/5 !border-white/10 !text-zinc-400',
        },
      }}
    />
  )
}
