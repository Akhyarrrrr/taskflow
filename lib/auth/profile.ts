import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

export function toUserProfile(user: User): UserProfile {
  const meta = user.user_metadata as Record<string, string | undefined> | undefined
  const email = user.email ?? ''
  const displayName =
    meta?.full_name?.trim() ||
    meta?.name?.trim() ||
    email.split('@')[0] ||
    'User'

  return {
    email,
    displayName,
    avatarUrl: meta?.avatar_url ?? null,
  }
}
