'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import type { UserProfile } from '@/types'
import { cn } from '@/lib/utils/cn'

function getInitials(name: string, email: string): string {
  const source = name.trim() || email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

interface UserMenuProps {
  user: UserProfile
  onLogout: () => void
  compact?: boolean
}

export function UserAvatar({ user, className }: { user: UserProfile; className?: string }) {
  const initials = getInitials(user.displayName, user.email)

  if (user.avatarUrl) {
    return (
      <Image
        src={user.avatarUrl}
        alt={user.displayName}
        width={40}
        height={40}
        className={cn('rounded-full object-cover ring-2 ring-teal-400/25', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 text-xs font-bold text-slate-950 ring-2 ring-white/10',
        className,
      )}
    >
      {initials}
    </div>
  )
}

export function UserMenu({ user, onLogout, compact }: UserMenuProps) {
  return (
    <div className={cn('flex items-center gap-2', compact && 'gap-1.5')}>
      <div className="flex items-center gap-2.5 border-l border-white/[0.08] pl-2 sm:pl-3">
        <UserAvatar user={user} />
        {!compact && (
          <div className="hidden max-w-[150px] text-left md:block">
            <p className="truncate text-sm font-medium text-zinc-200">{user.displayName}</p>
            <p className="truncate text-[11px] text-zinc-500">{user.email}</p>
          </div>
        )}
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="flex items-center gap-1.5 rounded-xl border border-transparent px-2.5 py-2 text-sm text-zinc-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
        title="Sign out"
      >
        <LogOut size={16} />
        <span className="hidden text-xs font-medium lg:inline">Sign out</span>
      </motion.button>
    </div>
  )
}
