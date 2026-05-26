import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toUserProfile } from '@/lib/auth/profile'
import BoardClient from './BoardClient'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: board } = await supabase.from('boards').select('title, description').eq('id', id).single()

  return {
    title: board?.title ?? 'Board',
    description: board?.description ?? 'Manage tasks, priorities, and deadlines on a TaskFlow Kanban board.',
    openGraph: {
      title: `${board?.title ?? 'Board'} - TaskFlow`,
      description: board?.description ?? 'A premium Kanban board for focused delivery.',
    },
  }
}

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!board) notFound()

  const { data: columns } = await supabase
    .from('columns')
    .select('*, tasks(*)')
    .eq('board_id', id)
    .order('position', { ascending: true })

  const { data: boards } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: false })

  const columnsWithSortedTasks = (columns ?? []).map(col => ({
    ...col,
    tasks: (col.tasks ?? []).sort(
      (a: { position: number }, b: { position: number }) => a.position - b.position,
    ),
  }))

  return (
    <BoardClient
      board={board}
      initialColumns={columnsWithSortedTasks}
      userId={user.id}
      user={toUserProfile(user)}
      boards={boards ?? []}
    />
  )
}
