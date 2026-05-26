'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, ShieldCheck, Sparkles } from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { AppLogo } from '@/components/layout/AppLogo'
import { GlassCard } from '@/components/ui/glass-card'
import { FadeUp } from '@/components/motion/fade-up'
import { cn } from '@/lib/utils/cn'

const cards = [
  { title: 'Shape onboarding flow', meta: 'Design', tone: 'from-teal-400 to-teal-300', x: 0, delay: 0 },
  { title: 'Review launch blockers', meta: 'Ops', tone: 'from-orange-400 to-orange-300', x: 28, delay: 0.12 },
  { title: 'Ship billing polish', meta: 'Product', tone: 'from-teal-300 to-teal-500', x: -18, delay: 0.24 },
]


interface AuthShellProps {
  children: React.ReactNode
  title: string
  subtitle: string
  footer: React.ReactNode
  mode?: 'login' | 'register'
}


function BrandPanel({ mirrored }: { mirrored: boolean }) {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-8 xl:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(13,148,136,0.16),transparent_30%),radial-gradient(circle_at_90%_30%,rgba(20,184,166,0.14),transparent_34%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <AppLogo href="/" size="lg" />
      </div>

      <div className="relative z-10 mx-auto my-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-teal-400/80">Sprint board</p>
              <h2 className="font-display text-2xl font-semibold text-white">Launch rhythm</h2>
            </div>
            <Sparkles className="h-5 w-5 text-teal-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Backlog', 'Active', 'Done'].map((column, columnIndex) => (
              <div key={column} className="rounded-2xl border border-white/8 bg-black/20 p-2">
                <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{column}</p>
                <div className="space-y-2">
                  {cards.slice(0, columnIndex + 1).map((card, cardIndex) => (
                    <motion.div
                      key={`${column}-${card.title}`}
                      animate={{
                        y: [0, -5, 0],
                        x: mirrored ? [-card.x / 4, card.x / 4, -card.x / 4] : [card.x / 4, -card.x / 4, card.x / 4],
                      }}
                      transition={{
                        duration: 4.5 + cardIndex,
                        delay: card.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="rounded-xl border border-white/10 bg-zinc-950/80 p-2.5 shadow-xl"
                    >
                      <div className={cn('mb-2 h-1.5 w-12 rounded-full bg-gradient-to-r', card.tone)} />
                      <p className="text-[11px] font-medium leading-snug text-zinc-100">{card.title}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{card.meta}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="font-display max-w-lg text-4xl font-semibold leading-tight tracking-[-0.02em] text-gradient xl:text-5xl">
            Bring every decision into focus.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
            TaskFlow turns scattered work into a calm, visual operating system for teams that care about craft and pace.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs text-zinc-400">
          {[
            { icon: CheckCircle2, label: 'Clear priorities' },
            { icon: Clock3, label: 'Deadline signals' },
            { icon: ShieldCheck, label: 'Secure by design' },
          ].map(item => (
            <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.035] p-3 backdrop-blur">
              <item.icon className="mb-2 h-4 w-4 text-teal-400" />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AuthShell({ children, title, subtitle, footer, mode = 'login' }: AuthShellProps) {
  const mirrored = mode === 'register'

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-gradient">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, x: mirrored ? 30 : -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'relative z-10 grid min-h-screen lg:grid-cols-2',
          mirrored && 'lg:[&>*:first-child]:order-2',
        )}
      >
        <section className="hidden border-white/[0.07] lg:block lg:border-r">
          <BrandPanel mirrored={mirrored} />
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-[28rem]">
            <div className="mb-8 flex justify-center lg:hidden">
              <AppLogo href="/login" size="lg" />
            </div>
            <FadeUp>
              <div className="mb-6 text-center lg:text-left">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.24em] text-teal-400">
                  TaskFlow Workspace
                </p>
                <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{subtitle}</p>
              </div>
              <GlassCard glow padding="lg" className="spotlight-card border-white/[0.11]">
                {children}
                <div className="mt-5 text-center text-sm text-zinc-500">{footer}</div>
              </GlassCard>
            </FadeUp>
            <p className="mt-6 text-center text-xs text-zinc-600">
              By continuing, you agree to focused work without the clutter.
            </p>

          </div>
        </section>
      </motion.div>
    </main>
  )
}
