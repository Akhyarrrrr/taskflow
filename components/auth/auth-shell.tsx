'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { AppLogo } from '@/components/layout/AppLogo'
import { GlassCard } from '@/components/ui/glass-card'
import { FadeUp } from '@/components/motion/fade-up'
import { CheckCircle2, Zap, Shield } from 'lucide-react'

const features = [
  { icon: Zap, text: 'Drag & drop antar kolom' },
  { icon: Shield, text: 'Data aman per akun (RLS)' },
  { icon: CheckCircle2, text: 'Prioritas & deadline task' },
]

interface AuthShellProps {
  children: React.ReactNode
  title: string
  subtitle: string
  footer: React.ReactNode
}

export function AuthShell({ children, title, subtitle, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-app-gradient relative flex">
      <AnimatedBackground />

      {/* Left panel — desktop */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 border-r border-white/[0.06]">
        <AppLogo href="/" />
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl xl:text-5xl font-bold leading-tight text-gradient max-w-md"
          >
            Kelola pekerjaan dengan flow yang natural.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 mt-4 max-w-sm text-base leading-relaxed"
          >
            Board Kanban modern — buat board, tambah task, geser kartu. Tanpa ribet, siap dipamerkan di portfolio.
          </motion.p>
          <ul className="mt-8 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f.text}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="flex items-center gap-3 text-sm text-zinc-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
                  <f.icon size={16} />
                </span>
                {f.text}
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-zinc-600">© {new Date().getFullYear()} Taskflow · Built with Next.js & Supabase</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-[420px]">
          <div className="lg:hidden mb-8 flex justify-center">
            <AppLogo href="/login" />
          </div>
          <FadeUp>
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl font-bold text-white">{title}</h2>
              <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
            </div>
            <GlassCard glow padding="lg" className="border-white/[0.1]">
              {children}
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-center text-sm text-zinc-500">
                {footer}
              </div>
            </GlassCard>
          </FadeUp>
        </div>
      </div>
    </div>
  )
}
