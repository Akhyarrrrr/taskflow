'use client'

import { AnimatedBackground } from '@/components/ui/animated-background'
import { AppLogo } from '@/components/layout/AppLogo'
import { UserMenu } from '@/components/layout/UserMenu'
import type { UserProfile } from '@/types'
import { cn } from '@/lib/utils/cn'

interface AppShellProps {
  children: React.ReactNode
  user?: UserProfile
  onLogout?: () => void
  header?: React.ReactNode
  className?: string
}

export function AppShell({ children, user, onLogout, header, className }: AppShellProps) {
  return (
    <div className={cn('min-h-screen bg-app-gradient relative', className)}>
      <AnimatedBackground />
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060a]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <AppLogo />
          {user && onLogout && <UserMenu user={user} onLogout={onLogout} />}
        </div>
        {header}
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  )
}
