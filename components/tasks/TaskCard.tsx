'use client'

import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Clock, Flag, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { priorityConfig } from '@/lib/constants/priority'
import { formatDueDate, isDueTomorrow, isOverdue } from '@/lib/utils/dates'
import { cn } from '@/lib/utils/cn'
import { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const p = priorityConfig[task.priority]
  const overdue = isOverdue(task.due_date)
  const dueTomorrow = isDueTomorrow(task.due_date)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={false}
      className={cn(
        'group card-shine rounded-xl border p-3.5 transition-all',
        isDragging
          ? 'opacity-40 scale-[0.98] border-violet-500/40 bg-violet-500/5'
          : 'border-white/[0.08] bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5',
        dueTomorrow && !overdue && 'ring-1 ring-cyan-500/30',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-0.5 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing shrink-0 touch-none p-0.5"
          aria-label="Drag"
        >
          <GripVertical size={14} />
        </button>
        <button type="button" onClick={() => onEdit(task)} className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-zinc-100 leading-snug group-hover:text-white transition-colors">
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className={cn('inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide', p.bg, p.color)}>
              <Flag size={9} />
              {p.label}
            </span>
            {task.due_date && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md',
                  overdue && 'bg-red-500/15 text-red-400',
                  dueTomorrow && !overdue && 'bg-cyan-500/15 text-cyan-300',
                  !overdue && !dueTomorrow && 'bg-white/5 text-zinc-500',
                )}
              >
                {dueTomorrow && !overdue ? <Clock size={9} /> : <Calendar size={9} />}
                {dueTomorrow && !overdue ? 'Tomorrow' : formatDueDate(task.due_date)}
              </span>
            )}
          </div>
        </button>
        <div className="flex flex-col gap-0.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-zinc-600 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition"
            aria-label="Edit"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            aria-label="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
