'use client'

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

export function UserMenu({ user, onLogout, compact }: UserMenuProps) {
  const initials = getInitials(user.displayName, user.email)

  return (
    <div className={cn('flex items-center gap-2', compact && 'gap-1.5')}>
      <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-white/[0.08]">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-violet-500/30"
          />
        ) : (
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10">
            {initials}
          </div>
        )}
        {!compact && (
          <div className="hidden md:block text-left max-w-[150px]">
            <p className="text-sm font-medium text-zinc-200 truncate">{user.displayName}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
          </div>
        )}
      </div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onLogout}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition px-2.5 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
        title="Keluar"
      >
        <LogOut size={16} />
        <span className="hidden lg:inline text-xs font-medium">Keluar</span>
      </motion.button>
    </div>
  )
}
