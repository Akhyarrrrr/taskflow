'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, ChevronLeft, Command, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Search, Settings, Sparkles } from 'lucide-react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { AppLogo } from '@/components/layout/AppLogo'
import { UserAvatar, UserMenu } from '@/components/layout/UserMenu'
import type { Board, UserProfile } from '@/types'
import { cn } from '@/lib/utils/cn'

interface AppShellProps {
  children: React.ReactNode
  user?: UserProfile
  onLogout?: () => void
  boards?: Board[]
  activeBoardId?: string
  header?: React.ReactNode
  className?: string
}

export function AppShell({ children, user, onLogout, boards = [], activeBoardId, header, className }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn('min-h-screen bg-app-gradient relative', className)}>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen">
        <aside
          className={cn(
            'hidden shrink-0 border-r border-white/[0.07] bg-black/20 backdrop-blur-xl transition-[width] duration-300 lg:block',
            collapsed ? 'w-[5rem]' : 'w-[17rem]',
          )}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <AppLogo />
            <button
              type="button"
              onClick={() => setCollapsed(value => !value)}
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </button>
          </div>
          <div className="px-3 py-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 text-slate-950">
                  <Command size={16} />
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">Core Workspace</p>
                    <p className="truncate text-xs text-zinc-500">Focused delivery</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <nav className="space-y-6 px-3 py-2">
            <div>
              {!collapsed && <p className="px-2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">Boards</p>}
              <div className="mt-2 space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <LayoutDashboard size={17} />
                  {!collapsed && <span>All boards</span>}
                </Link>
                {boards.slice(0, 7).map(board => (
                  <Link
                    key={board.id}
                    href={`/board/${board.id}`}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white',
                      activeBoardId === board.id && 'bg-teal-400/10 text-teal-200 ring-1 ring-teal-400/15',
                    )}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-teal-400" />
                    {!collapsed && <span className="truncate">{board.title}</span>}
                  </Link>
                ))}
              </div>
            </div>

          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#05060a]/75 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
              <div className="lg:hidden">
                <AppLogo />
              </div>
              {activeBoardId && (
                <Link
                  href="/dashboard"
                  aria-label="Back to dashboard"
                  className="hidden rounded-xl p-2 text-zinc-500 transition hover:bg-white/[0.06] hover:text-white sm:inline-flex"
                >
                  <ChevronLeft size={18} />
                </Link>
              )}
              <div className="relative mx-auto hidden w-full max-w-xl md:block">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="search"
                  placeholder="Search boards, tasks, and deadlines"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-teal-400/45 focus:ring-2 focus:ring-teal-400/20"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">

                {user && !onLogout && <UserAvatar user={user} />}
                {user && onLogout && <UserMenu user={user} onLogout={onLogout} compact />}
              </div>
            </div>
            {header}
          </header>
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
