import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { toUserProfile } from '@/lib/auth/profile'
import BoardClient from './BoardClient'

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
    />
  )
}
