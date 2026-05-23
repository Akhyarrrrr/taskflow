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

export default function DashboardClient({ boards: initialBoards, user, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [boards, setBoards] = useState(initialBoards)
  const [showModal, setShowModal] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverId, setCoverId] = useState<BoardCoverId>(DEFAULT_COVER_ID)
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
    notify.info('Kamu telah keluar', 'Sampai jumpa lagi!')
    router.push('/login')
    router.refresh()
  }

  async function handleCreateBoard(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const base = { user_id: userId, title: title.trim(), description: description.trim() || null }
    let { data, error } = await supabase.from('boards').insert({ ...base, cover_color: coverId }).select().single()

    if (error?.message?.includes('cover_color')) {
      const fb = await supabase.from('boards').insert(base).select().single()
      data = fb.data
      error = fb.error
    }

    if (error) {
      notify.error('Board gagal dibuat', error.message)
    } else if (data) {
      setBoards(prev => [data, ...prev])
      setTitle('')
      setDescription('')
      setCoverId(DEFAULT_COVER_ID)
      setShowModal(false)
      notify.success('Board berhasil dibuat', `«${data.title}» siap dengan 3 kolom Kanban.`)
    }
    setLoading(false)
  }

  async function confirmDeleteBoard() {
    if (!deleteTarget) return
    setDeleting(true)
    const { error } = await supabase.from('boards').delete().eq('id', deleteTarget.id)
    if (error) {
      notify.error('Gagal menghapus board', error.message)
    } else {
      setBoards(prev => prev.filter(b => b.id !== deleteTarget.id))
      notify.success('Board dihapus', `«${deleteTarget.title}» dan semua task-nya telah dihapus.`)
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <AppShell user={user} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Stagger className="space-y-8">
          <StaggerItem>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-sm text-violet-400 font-medium mb-1">
                  Halo, {user.displayName.split(' ')[0]} 👋
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Workspace kamu
                </h1>
                <p className="text-zinc-500 text-sm sm:text-base mt-2 max-w-lg">
                  Kelola proyek di board Kanban. Setiap board otomatis punya kolom To Do, In Progress, dan Done.
                </p>
              </div>
              <Button
                icon={<Plus size={16} />}
                onClick={() => setShowModal(true)}
                size="lg"
                className="w-full sm:w-auto shrink-0"
              >
                Board baru
              </Button>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatPill icon={FolderKanban} label="Total board" value={stats.total} tone="violet" />
              <StatPill icon={LayoutGrid} label="Kolom aktif" value={stats.columns} tone="cyan" />
              <StatPill icon={Calendar} label="Board bulan ini" value={stats.thisMonth} tone="amber" />
              <StatPill
                icon={Sparkles}
                label="Status"
                value={stats.total > 0 ? 'Aktif' : 'Kosong'}
                tone="emerald"
              />
            </div>
          </StaggerItem>

          <StaggerItem>
            {boards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 sm:p-16 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10 pointer-events-none" />
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center ring-1 ring-white/10">
                    <LayoutGrid size={36} className="text-violet-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Belum ada board</h2>
                  <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
                    Buat board pertama untuk mulai menambah task, mengatur prioritas, dan menyeret kartu antar kolom.
                  </p>
                  <Button
                    className="mt-8"
                    icon={<Sparkles size={16} />}
                    onClick={() => setShowModal(true)}
                  >
                    Buat board pertama
                  </Button>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {boards.map((board, i) => {
                  const cover = getBoardCover(board.cover_color)
                  return (
                    <motion.article
                      key={board.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      className="group card-shine relative rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden cursor-pointer hover:border-white/15 hover:shadow-2xl hover:shadow-violet-500/10 transition-shadow"
                      onClick={() => router.push(`/board/${board.id}`)}
                    >
                      <div className={cn('h-24 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition', cover.gradient)} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white text-lg truncate pr-2 group-hover:text-violet-100 transition-colors">
                            {board.title}
                          </h3>
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              setDeleteTarget(board)
                            }}
                            className="shrink-0 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                            aria-label="Hapus board"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <p className="text-zinc-500 text-sm mt-2 line-clamp-2 min-h-[2.5rem]">
                          {board.description || 'Tanpa deskripsi — klik untuk membuka board.'}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                          <span className="text-[11px] text-zinc-600 flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(board.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-[11px] font-medium text-violet-400/90 group-hover:text-violet-300">
                            Buka board →
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
        title="Board baru"
        description="Setiap board mendapat 3 kolom: To Do, In Progress, Done."
      >
        <form onSubmit={handleCreateBoard} className="space-y-4 -mt-2">
          <Input
            label="Judul *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Mis. Peluncuran produk"
            required
            autoFocus
          />
          <Textarea
            label="Deskripsi"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tujuan atau scope board ini..."
            rows={2}
          />
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Warna cover</label>
            <div className="flex flex-wrap gap-2">
              {BOARD_COVERS.map(c => (
                <motion.button
                  key={c.id}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCoverId(c.id)}
                  className={cn(
                    'w-10 h-10 rounded-xl transition ring-2 ring-offset-2 ring-offset-[#0c0c12]',
                    c.swatch,
                    coverId === c.id ? 'ring-white scale-105' : 'ring-transparent opacity-60 hover:opacity-100',
                  )}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              Buat board
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus board?"
        description={`Board «${deleteTarget?.title}» dan semua task di dalamnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, hapus"
        cancelLabel="Batal"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDeleteBoard}
        onCancel={() => setDeleteTarget(null)}
      />
    </AppShell>
  )
}
