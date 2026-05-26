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
import { AlertCircle, CheckCircle2, Circle, Inbox, ListTodo, Plus, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getBoardCover } from '@/lib/constants/board-covers'
import { isDueTomorrow, isOverdue } from '@/lib/utils/dates'
import { AppShell } from '@/components/layout/AppShell'
import { TaskCard } from '@/components/tasks/TaskCard'
import { TaskFormModal, TaskFormValues } from '@/components/tasks/TaskFormModal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StatPill } from '@/components/ui/stat-pill'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'
import { Board, Column, Task, UserProfile } from '@/types'

type ColumnWithTasks = Column & { tasks: Task[] }

function filterTasksByQuery(tasks: Task[], query: string): Task[] {
  const q = query.trim().toLowerCase()
  if (!q) return tasks
  return tasks.filter(
    task =>
      task.title.toLowerCase().includes(q) ||
      (task.description?.toLowerCase().includes(q) ?? false),
  )
}

function EmptyColumn({ isFiltering, onAddClick }: { isFiltering: boolean; onAddClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.025] px-3 py-10 text-center"
    >
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Inbox size={22} className="text-zinc-600" />
      </div>
      <p className="text-xs font-medium text-zinc-500">{isFiltering ? 'No matching tasks' : 'This column is clear'}</p>
      {!isFiltering && (
        <button type="button" onClick={onAddClick} className="mt-2 text-xs font-medium text-teal-400 hover:text-teal-300">
          Add task
        </button>
      )}
    </motion.div>
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
  const highCount = tasks.filter(task => task.priority === 'high').length

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className={cn(
        'flex max-h-[calc(100dvh-15rem)] w-[min(calc(100vw-1.5rem),21rem)] flex-shrink-0 flex-col rounded-3xl border backdrop-blur-xl transition-all duration-300 sm:max-h-[calc(100vh-15rem)] sm:w-[19.5rem]',
        isOver
          ? 'scale-[1.01] border-teal-400/45 bg-teal-400/5 shadow-lg shadow-teal-500/10'
          : 'border-white/[0.08] bg-white/[0.035]',
      )}
    >
      <div className="shrink-0 border-b border-white/[0.06] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/10" style={{ backgroundColor: column.color }} />
            <span className="truncate text-sm font-semibold text-zinc-100">{column.title}</span>
            <span className="rounded-full border border-white/[0.06] bg-white/5 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-500">
              {tasks.length}
            </span>
          </div>
          <motion.button
            type="button"
            whileHover={{ width: 92 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddClick}
            className="group inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition hover:border-teal-400/30 hover:text-teal-300"
            aria-label={`Add task to ${column.title}`}
          >
            <Plus size={16} className="shrink-0" />
            <span className="ml-1 hidden whitespace-nowrap text-xs font-medium group-hover:inline">Add</span>
          </motion.button>
        </div>
        {highCount > 0 && column.title === 'To Do' && (
          <p className="mt-2 flex items-center gap-1 text-[10px] text-amber-300/90">
            <AlertCircle size={10} /> {highCount} high-priority {highCount === 1 ? 'task' : 'tasks'}
          </p>
        )}
      </div>

      <div className="custom-scrollbar min-h-[100px] flex-1 space-y-2.5 overflow-y-auto p-3">
        <SortableContext items={visibleTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {visibleTasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {visibleTasks.length === 0 && <EmptyColumn isFiltering={isFiltering} onAddClick={onAddClick} />}
      </div>
    </motion.div>
  )
}

interface Props {
  board: Board
  initialColumns: ColumnWithTasks[]
  userId: string
  user: UserProfile
  boards: Board[]
}

export default function BoardClient({ board, initialColumns, userId, user, boards }: Props) {
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
    const all = columns.flatMap(column => column.tasks)
    return {
      total: all.length,
      done: columns.find(column => column.title === 'Done')?.tasks.length ?? columns[2]?.tasks.length ?? 0,
      overdue: all.filter(task => isOverdue(task.due_date)).length,
      tomorrow: all.filter(task => isDueTomorrow(task.due_date)).length,
      high: all.filter(task => task.priority === 'high').length,
    }
  }, [columns])

  const filteredTotal = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return boardStats.total
    return columns.reduce((count, column) => count + filterTasksByQuery(column.tasks, q).length, 0)
  }, [columns, searchQuery, boardStats.total])

  function findColumnByTaskId(taskId: string) {
    return columns.find(column => column.tasks.some(task => task.id === taskId))
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTask((event.active.data.current?.task as Task) ?? null)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeCol = findColumnByTaskId(active.id as string)
    const overCol = columns.find(column => column.id === over.id) ?? findColumnByTaskId(over.id as string)
    if (!activeCol || !overCol || activeCol.id === overCol.id) return

    setColumns(prev => {
      const task = activeCol.tasks.find(item => item.id === active.id)!
      return prev.map(column => {
        if (column.id === activeCol.id) return { ...column, tasks: column.tasks.filter(item => item.id !== active.id) }
        if (column.id === overCol.id) return { ...column, tasks: [...column.tasks, { ...task, column_id: overCol.id }] }
        return column
      })
    })
  }

  async function persistColumnTasks(column: ColumnWithTasks) {
    await Promise.all(
      column.tasks.map((task, index) =>
        supabase.from('tasks').update({ position: index, column_id: column.id }).eq('id', task.id),
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

    const overCol = columns.find(column => column.id === over.id) ?? findColumnByTaskId(over.id as string)
    if (!overCol) return

    const activeIndex = activeCol.tasks.findIndex(task => task.id === activeId)
    let overIndex = over.id === overCol.id ? overCol.tasks.length - 1 : overCol.tasks.findIndex(task => task.id === over.id)
    if (activeIndex === -1) return
    if (overIndex === -1) overIndex = overCol.tasks.length - 1

    if (activeCol.id === overCol.id) {
      if (activeIndex === overIndex) return
      const reordered = arrayMove(activeCol.tasks, activeIndex, overIndex)
      setColumns(prev => prev.map(column => (column.id === activeCol.id ? { ...column, tasks: reordered } : column)))
      const results = await Promise.all(
        reordered.map((task, index) => supabase.from('tasks').update({ position: index }).eq('id', task.id)),
      )
      if (results.some(result => result.error)) {
        notify.error('Unable to reorder task')
        router.refresh()
      } else {
        notify.info('Order updated', `Task positions in "${activeCol.title}" were saved.`)
      }
      return
    }

    const destCol = columns.find(column => column.id === overCol.id)
    if (!destCol) return

    const { error } = await supabase.from('tasks').update({ column_id: overCol.id }).eq('id', activeId)
    if (error) {
      notify.error('Unable to move task', error.message)
      router.refresh()
      return
    }
    await persistColumnTasks(destCol)
    notify.success('Task moved', `Dropped into "${overCol.title}".`)
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

      if (error) notify.error('Unable to save task', error.message)
      else if (data) {
        setColumns(prev => prev.map(column => ({ ...column, tasks: column.tasks.map(task => (task.id === data.id ? data : task)) })))
        setTaskModal({ open: false, mode: 'create' })
        notify.success('Task updated', `"${data.title}" was saved.`)
      }
    } else if (taskModal.columnId) {
      const column = columns.find(item => item.id === taskModal.columnId)!
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          column_id: taskModal.columnId,
          user_id: userId,
          title: values.title,
          description: values.description || null,
          priority: values.priority,
          due_date: values.dueDate || null,
          position: column.tasks.length,
        })
        .select()
        .single()

      if (error) notify.error('Unable to add task', error.message)
      else if (data) {
        setColumns(prev =>
          prev.map(item => (item.id === taskModal.columnId ? { ...item, tasks: [...item.tasks, data] } : item)),
        )
        setTaskModal({ open: false, mode: 'create' })
        notify.success('Task added', `Added to "${taskModal.columnTitle}".`)
      }
    }
    setSaving(false)
  }

  async function confirmDeleteTask() {
    if (!deleteTaskId) return
    setDeleting(true)
    const { error } = await supabase.from('tasks').delete().eq('id', deleteTaskId)
    if (error) notify.error('Unable to delete task', error.message)
    else {
      setColumns(prev => prev.map(column => ({ ...column, tasks: column.tasks.filter(task => task.id !== deleteTaskId) })))
      notify.success('Task deleted')
    }
    setDeleting(false)
    setDeleteTaskId(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    notify.info('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <AppShell
      user={user}
      onLogout={handleLogout}
      boards={boards}
      activeBoardId={board.id}
      header={
        <div>
          <div className={cn('h-1 bg-gradient-to-r', cover.gradient)} />
          <div className="space-y-3 px-3 pb-3 sm:px-6">
            <div className="flex min-w-0 flex-col gap-1 pt-3">
              <h1 className="font-display truncate text-xl font-semibold tracking-[-0.02em] text-white sm:text-2xl">{board.title}</h1>
              <p className="truncate text-xs text-zinc-500 sm:text-sm">
                {board.description || 'Drag cards between columns and keep the next decision visible.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatPill icon={ListTodo} label="Total tasks" value={boardStats.total} tone="teal" />
              <StatPill icon={CheckCircle2} label="Done" value={boardStats.done} tone="teal" />
              <StatPill icon={AlertCircle} label="Overdue" value={boardStats.overdue} tone="amber" />
              <StatPill icon={Circle} label="High priority" value={boardStats.high} tone="cyan" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title or description"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400/25"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-zinc-500 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <p className="shrink-0 px-1 text-xs text-zinc-500">
                {searchActive
                  ? `${filteredTotal} of ${boardStats.total} tasks`
                  : boardStats.tomorrow > 0
                    ? `${boardStats.tomorrow} due tomorrow`
                    : 'Drag cards to move work'}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="kanban-scroll relative z-10 flex-1 overflow-x-auto">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="flex min-h-[calc(100dvh-17rem)] w-max min-w-full gap-3 p-3 pb-24 sm:gap-4 sm:p-6 sm:pb-8">
            {columns.map(column => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={column.tasks}
                searchQuery={searchQuery}
                onAddClick={() => openCreate(column.id, column.title)}
                onEditTask={openEdit}
                onDeleteTask={id => setDeleteTaskId(id)}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 220, easing: 'ease' }}>
            {activeTask && (
              <div className="w-72 rotate-2 cursor-grabbing rounded-2xl border border-teal-400/45 bg-[#10131a]/95 p-4 shadow-2xl shadow-teal-500/20 backdrop-blur">
                <p className="text-sm font-semibold text-white">{activeTask.title}</p>
                <p className="mt-1 text-xs text-zinc-500">Release in the target column</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
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
        title="Delete task?"
        description="This task will be permanently removed from the board."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteTaskId(null)}
      />
    </AppShell>
  )
}
