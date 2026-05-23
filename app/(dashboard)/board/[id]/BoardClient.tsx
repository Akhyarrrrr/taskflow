'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Inbox,
  ListTodo,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getBoardCover } from '@/lib/constants/board-covers'
import { isDueTomorrow, isOverdue } from '@/lib/utils/dates'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { AppLogo } from '@/components/layout/AppLogo'
import { UserMenu } from '@/components/layout/UserMenu'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFormModal, TaskFormValues } from '@/components/tasks/TaskFormModal'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatPill } from '@/components/ui/stat-pill'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'
import { Board, Column, Priority, Task, UserProfile } from '@/types'

type ColumnWithTasks = Column & { tasks: Task[] }

function filterTasksByQuery(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase()
  if (!q) return tasks
  return tasks.filter(
    t =>
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false),
  )
}

function KanbanColumn({
  column,
  tasks,
  searchQuery,
  onAddClick,
  onEditTask,
  onDeleteTask,
}: {
  column: Column
  tasks: Task[]
  searchQuery: string
  onAddClick: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const visibleTasks = filterTasksByQuery(tasks, searchQuery)
  const isFiltering = searchQuery.trim().length > 0
  const highCount = tasks.filter(t => t.priority === 'high').length

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-[min(calc(100vw-1.5rem),20rem)] sm:w-[18rem] flex flex-col max-h-[calc(100dvh-11rem)] sm:max-h-[calc(100vh-12rem)] rounded-2xl border backdrop-blur-xl transition-all duration-300',
        isOver
          ? 'border-violet-500/50 bg-violet-500/5 shadow-lg shadow-violet-500/10 scale-[1.01]'
          : 'border-white/[0.08] bg-white/[0.03]',
      )}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/10"
            style={{ backgroundColor: column.color }}
          />
          <span className="text-sm font-semibold text-zinc-100 truncate">{column.title}</span>
          <span className="text-xs font-medium text-zinc-500 bg-white/5 border border-white/[0.06] px-2 py-0.5 rounded-full tabular-nums">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onAddClick} className="!h-8 !w-8 !p-0" icon={<Plus size={16} />} />
      </div>

      {highCount > 0 && column.title === 'To Do' && (
        <p className="px-3 pt-2 text-[10px] text-amber-400/90 flex items-center gap-1">
          <AlertCircle size={10} /> {highCount} prioritas tinggi
        </p>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[100px] custom-scrollbar">
        <SortableContext items={visibleTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {visibleTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {visibleTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 px-3 text-center rounded-xl border border-dashed border-white/[0.08] bg-white/[0.02]"
          >
            <Inbox size={24} className="text-zinc-600 mb-2" />
            <p className="text-xs text-zinc-500 font-medium">
              {isFiltering ? 'Tidak ada task yang cocok' : 'Kolom masih kosong'}
            </p>
            {!isFiltering && (
              <button
                type="button"
                onClick={onAddClick}
                className="mt-2 text-xs text-violet-400 hover:text-violet-300 font-medium"
              >
                + Tambah task
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

interface Props {
  board: Board
  initialColumns: ColumnWithTasks[]
  userId: string
  user: UserProfile
}

export default function BoardClient({ board, initialColumns, userId, user }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [columns, setColumns] = useState(initialColumns)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [taskModal, setTaskModal] = useState<{
    open: boolean
    mode: 'create' | 'edit'
    columnId?: string
    columnTitle?: string
    task?: Task
  }>({ open: false, mode: 'create' })
  const [saving, setSaving] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const cover = getBoardCover(board.cover_color)
  const searchActive = searchQuery.trim().length > 0
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 }, disabled: searchActive }),
  )

  const boardStats = useMemo(() => {
    const all = columns.flatMap(c => c.tasks)
    return {
      total: all.length,
      done: columns.find(c => c.title === 'Done')?.tasks.length ?? columns[2]?.tasks.length ?? 0,
      overdue: all.filter(t => isOverdue(t.due_date)).length,
      tomorrow: all.filter(t => isDueTomorrow(t.due_date)).length,
      high: all.filter(t => t.priority === 'high').length,
    }
  }, [columns])

  const filteredTotal = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return boardStats.total
    return columns.reduce((n, col) => n + filterTasksByQuery(col.tasks, q).length, 0)
  }, [columns, searchQuery, boardStats.total])

  function findColumnByTaskId(taskId: string) {
    return columns.find(col => col.tasks.some(t => t.id === taskId))
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask((event.active.data.current?.task as Task) ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeCol = findColumnByTaskId(active.id as string)
    const overCol = columns.find(c => c.id === over.id) ?? findColumnByTaskId(over.id as string)
    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    setColumns(prev => {
      const task = activeCol.tasks.find(t => t.id === active.id)!
      return prev.map(col => {
        if (col.id === activeCol.id) return { ...col, tasks: col.tasks.filter(t => t.id !== active.id) }
        if (col.id === overCol.id) return { ...col, tasks: [...col.tasks, { ...task, column_id: overCol.id }] }
        return col
      })
    })
  }

  async function persistColumnTasks(col: ColumnWithTasks) {
    await Promise.all(
      col.tasks.map((t, index) =>
        supabase.from('tasks').update({ position: index, column_id: col.id }).eq('id', t.id),
      ),
    )
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeId = active.id as string
    const activeCol = findColumnByTaskId(activeId)
    if (!activeCol) return

    const overCol = columns.find(c => c.id === over.id) ?? findColumnByTaskId(over.id as string)
    if (!overCol) return

    const activeIndex = activeCol.tasks.findIndex(t => t.id === activeId)
    let overIndex =
      over.id === overCol.id ? overCol.tasks.length - 1 : overCol.tasks.findIndex(t => t.id === over.id)
    if (activeIndex === -1) return
    if (overIndex === -1) overIndex = overCol.tasks.length - 1

    if (activeCol.id === overCol.id) {
      if (activeIndex === overIndex) return
      const reordered = arrayMove(activeCol.tasks, activeIndex, overIndex)
      setColumns(prev => prev.map(col => (col.id === activeCol.id ? { ...col, tasks: reordered } : col)))
      const results = await Promise.all(
        reordered.map((t, i) => supabase.from('tasks').update({ position: i }).eq('id', t.id)),
      )
      if (results.some(r => r.error)) {
        notify.error('Gagal mengurutkan task')
        router.refresh()
      } else {
        notify.info('Urutan diperbarui', `Posisi task di «${activeCol.title}» disimpan.`)
      }
      return
    }

    const destCol = columns.find(c => c.id === overCol.id)
    if (!destCol) return

    const { error } = await supabase.from('tasks').update({ column_id: overCol.id }).eq('id', activeId)
    if (error) {
      notify.error('Gagal memindahkan task', error.message)
      router.refresh()
      return
    }
    await persistColumnTasks(destCol)
    notify.success('Task dipindah', `Ke kolom «${overCol.title}».`)
  }

  function openCreate(columnId: string, columnTitle: string) {
    setTaskModal({ open: true, mode: 'create', columnId, columnTitle })
  }

  function openEdit(task: Task) {
    setTaskModal({ open: true, mode: 'edit', task })
  }

  async function handleTaskSubmit(values: TaskFormValues) {
    setSaving(true)
    if (taskModal.mode === 'edit' && taskModal.task) {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          due_date: values.dueDate || null,
        })
        .eq('id', taskModal.task.id)
        .select()
        .single()

      if (error) notify.error('Gagal menyimpan', error.message)
      else if (data) {
        setColumns(prev => prev.map(col => ({ ...col, tasks: col.tasks.map(t => (t.id === data.id ? data : t)) })))
        setTaskModal({ open: false, mode: 'create' })
        notify.success('Task diperbarui', `«${data.title}» telah disimpan.`)
      }
    } else if (taskModal.columnId) {
      const col = columns.find(c => c.id === taskModal.columnId)!
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          column_id: taskModal.columnId,
          user_id: userId,
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          due_date: values.dueDate || null,
          position: col.tasks.length,
        })
        .select()
        .single()

      if (error) notify.error('Gagal menambah task', error.message)
      else if (data) {
        setColumns(prev =>
          prev.map(c => (c.id === taskModal.columnId ? { ...c, tasks: [...c.tasks, data] } : c)),
        )
        setTaskModal({ open: false, mode: 'create' })
        notify.success('Task ditambahkan', `Di kolom «${taskModal.columnTitle}».`)
      }
    }
    setSaving(false)
  }

  async function confirmDeleteTask() {
    if (!deleteTaskId) return
    setDeleting(true)
    const { error } = await supabase.from('tasks').delete().eq('id', deleteTaskId)
    if (error) notify.error('Gagal menghapus', error.message)
    else {
      setColumns(prev => prev.map(col => ({ ...col, tasks: col.tasks.filter(t => t.id !== deleteTaskId) })))
      notify.success('Task dihapus')
    }
    setDeleting(false)
    setDeleteTaskId(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    notify.info('Kamu telah keluar')
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-app-gradient flex flex-col relative">
      <AnimatedBackground />

      <header className="sticky top-0 z-30 shrink-0 border-b border-white/[0.06] bg-[#06060a]/75 backdrop-blur-xl">
        <div className={cn('h-1 bg-gradient-to-r', cover.gradient)} />

        <div className="px-3 sm:px-6 py-3 flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            icon={<ArrowLeft size={18} />}
            className="shrink-0"
            aria-label="Kembali"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">{board.title}</h1>
            <p className="text-xs text-zinc-500 truncate hidden sm:block">
              {board.description || 'Drag task antar kolom · Klik kartu untuk edit'}
            </p>
          </div>
          <div className="hidden md:block">
            <AppLogo href="/dashboard" />
          </div>
          <div className="hidden sm:block">
            <UserMenu user={user} onLogout={handleLogout} compact />
          </div>
        </div>

        <div className="px-3 sm:px-6 pb-3 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatPill icon={ListTodo} label="Total task" value={boardStats.total} tone="violet" />
            <StatPill icon={CheckCircle2} label="Selesai" value={boardStats.done} tone="emerald" />
            <StatPill icon={AlertCircle} label="Terlambat" value={boardStats.overdue} tone="amber" />
            <StatPill icon={Circle} label="Prioritas tinggi" value={boardStats.high} tone="cyan" />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari task berdasarkan judul atau deskripsi..."
                className="w-full h-10 pl-10 pr-10 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-white rounded-lg"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-500 shrink-0 px-1">
              {searchActive
                ? `${filteredTotal} dari ${boardStats.total} task`
                : boardStats.tomorrow > 0
                  ? `${boardStats.tomorrow} deadline besok`
                  : 'Geser kartu untuk memindahkan'}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto kanban-scroll relative z-10">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex gap-3 sm:gap-4 p-3 sm:p-6 min-h-full w-max min-w-full pb-24 sm:pb-8">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={col.tasks}
                searchQuery={searchQuery}
                onAddClick={() => openCreate(col.id, col.title)}
                onEditTask={openEdit}
                onDeleteTask={id => setDeleteTaskId(id)}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: 'ease' }}>
            {activeTask && (
              <div className="rounded-xl border border-violet-500/50 bg-[#12121a]/95 backdrop-blur p-4 w-72 shadow-2xl shadow-violet-500/20 rotate-2 cursor-grabbing">
                <p className="text-sm font-semibold text-white">{activeTask.title}</p>
                <p className="text-xs text-zinc-500 mt-1">Lepas di kolom tujuan</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/[0.08] bg-[#06060a]/90 backdrop-blur-xl px-4 py-3 flex justify-between items-center">
        <UserMenu user={user} onLogout={handleLogout} compact />
        <p className="text-[10px] text-zinc-600">Taskflow · Kanban</p>
      </div>

      <TaskFormModal
        open={taskModal.open}
        mode={taskModal.mode}
        initialTask={taskModal.task}
        columnTitle={taskModal.columnTitle}
        onClose={() => setTaskModal({ open: false, mode: 'create' })}
        onSubmit={handleTaskSubmit}
        loading={saving}
      />

      <ConfirmDialog
        open={!!deleteTaskId}
        title="Hapus task?"
        description="Task ini akan dihapus permanen dari board."
        confirmLabel="Hapus"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  )
}
