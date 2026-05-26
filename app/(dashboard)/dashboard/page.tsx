import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toUserProfile } from '@/lib/auth/profile'
import DashboardClient from './DashboardClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View and manage every TaskFlow Kanban board in your workspace.',
  openGraph: {
    title: 'Dashboard - TaskFlow',
    description: 'Your premium Kanban command center.',
  },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: boards } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <DashboardClient
      boards={boards ?? []}
      user={toUserProfile(user)}
      userId={user.id}
    />
  )
}
