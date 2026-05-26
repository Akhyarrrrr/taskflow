'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, FolderKanban, LayoutGrid, Plus, Sparkles, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AppShell } from '@/components/layout/AppShell'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatPill } from '@/components/ui/stat-pill'
import { Stagger, StaggerItem } from '@/components/motion/fade-up'
import { BOARD_COVERS, BoardCoverId, DEFAULT_COVER_ID, getBoardCover } from '@/lib/constants/board-covers'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'
import { Board, UserProfile } from '@/types'

interface Props {
  boards: Board[]
  user: UserProfile
  userId: string
}

function EmptyIllustration() {
  return (
    <div className="mx-auto mb-7 grid h-28 w-36 grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-black/30">
      {['bg-teal-400/25', 'bg-sky-400/20', 'bg-fuchsia-400/20'].map((tone, column) => (
        <div key={tone} className="space-y-2 rounded-2xl border border-white/8 bg-black/20 p-1.5">
          {Array.from({ length: column + 1 }).map((_, index) => (
            <motion.div
              key={index}
              className={cn('h-5 rounded-lg', tone)}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5 + index, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function DashboardClient({ boards: initialBoards, user, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [boards, setBoards] = useState(initialBoards)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [loading, setLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Board | null>(null)
  const [deleting, setDeleting] = useState(false)

  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = boards.filter(b => {
      const d = new Date(b.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
    return { total: boards.length, thisMonth, columns: boards.length * 3 }
  }, [boards])

  async function handleLogout() {
    await supabase.auth.signOut()
    notify.info('Signed out', 'Your workspace is ready when you return.')
    router.push('/login')
    router.refresh()
  }

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const base = { user_id: userId, title: title.trim(), description: description.trim() || null }
    let { data, error } = await supabase.from('boards').insert({ ...base, cover_color: 'emerald' as BoardCoverId }).select().single()

    if (error?.message?.includes('cover_color')) {
      const fallback = await supabase.from('boards').insert(base).select().single()
      data = fallback.data
      error = fallback.error
    }

    if (error) {
      notify.error('Board was not created', error.message)
    } else if (data) {
      setBoards(prev => [data, ...prev])
      setTitle('')
      setDescription('')
      setShowModal(false)
      notify.success('Board created', `"${data.title}" is ready with three Kanban columns.`)
    }
    setLoading(false)
  }

  async function confirmDeleteBoard() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('boards').delete().eq('id', deleteTarget.id)
    if (error) {
      notify.error('Unable to delete board', error.message)
    } else {
      setBoards(prev => prev.filter(b => b.id !== deleteTarget.id))
      notify.success('Board deleted', `"${deleteTarget.title}" and its tasks were removed.`)
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <AppShell user={user} onLogout={handleLogout} boards={boards}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Stagger className="space-y-8">
          <StaggerItem>
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-teal-400">
                  Good to see you, {user.displayName.split(' ')[0]}
                </p>
                <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                  Your command center
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
                  Organize projects into polished boards with priorities, deadlines, and drag-and-drop flow.
                </p>
              </div>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button icon={<Plus size={16} />} onClick={() => setShowModal(true)} size="lg" className="w-full sm:w-auto">
                  New board
                </Button>
              </motion.div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatPill icon={FolderKanban} label="Total boards" value={stats.total} tone="teal" />
              <StatPill icon={LayoutGrid} label="Active columns" value={stats.columns} tone="cyan" />
              <StatPill icon={Calendar} label="Created this month" value={stats.thisMonth} tone="amber" />
              <StatPill icon={Sparkles} label="Workspace" value={stats.total > 0 ? 'Active' : 'New'} tone="violet" />
            </div>
          </StaggerItem>

          <StaggerItem>
            {boards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="spotlight-card relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-12 text-center sm:p-16"
              >
                <EmptyIllustration />
                <h2 className="font-display text-2xl font-semibold text-white">Build your first operating board</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500">
                  Start with one project, add the work that matters, and move cards as decisions become progress.
                </p>
                <Button className="mt-8" icon={<Sparkles size={16} />} onClick={() => setShowModal(true)}>
                  Create first board
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {boards.map((board, i) => {
                  const cover = getBoardCover(board.cover_color)
                  return (
                    <motion.article
                      key={board.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ delay: i * 0.04, duration: 0.42 }}
                      whileHover={{ y: -5 }}
                      className="group card-shine spotlight-card relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] transition-shadow hover:border-white/15 hover:shadow-2xl hover:shadow-teal-500/15"
                      onClick={() => router.push(`/board/${board.id}`)}
                    >
                      <div className={cn('h-24 bg-gradient-to-br opacity-90 transition group-hover:opacity-100', cover.gradient)} />
                      <div className="relative p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="truncate pr-2 text-lg font-semibold text-white transition-colors group-hover:text-teal-100">
                            {board.title}
                          </h3>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              setDeleteTarget(board)
                            }}
                            className="shrink-0 rounded-xl p-2 text-zinc-600 opacity-100 transition hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label="Delete board"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="mt-2 min-h-[2.5rem] line-clamp-2 text-sm text-zinc-500">
                          {board.description || 'No description yet. Open the board to shape the workflow.'}
                        </p>
                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
                          <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                            <Calendar size={12} />
                            {new Date(board.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-[11px] font-medium text-teal-400/90 group-hover:text-teal-300">
                            Open board
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </div>
            )}
          </StaggerItem>
        </Stagger>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New board"
        description="Every board starts with To Do, In Progress, and Done columns."
      >
        <form onSubmit={handleCreateBoard} className="-mt-2 space-y-4">
          <Input
            label="Title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Product launch"
            required
            autoFocus
          />
          <Textarea
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What outcome should this board drive?"
            rows={2}
          />

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Create board
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete board?"
        description={`"${deleteTarget?.title}" and every task inside it will be permanently removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDeleteBoard}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  )
}
