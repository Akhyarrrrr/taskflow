'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Priority, Task } from '@/types'

export interface TaskFormValues {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

interface TaskFormModalProps {
  open: boolean
  mode: 'create' | 'edit'
  initialTask?: Task | null
  columnTitle?: string
  onClose: () => void
  onSubmit: (values: TaskFormValues) => Promise<void>
  loading?: boolean
}

const emptyValues: TaskFormValues = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
}

function getInitialValues(mode: 'create' | 'edit', task?: Task | null): TaskFormValues {
  if (mode !== 'edit' || !task) return emptyValues
  return {
    title: task.title,
    description: task.description ?? '',
    priority: task.priority,
    dueDate: task.due_date ?? '',
  }
}

function TaskFormFields({
  mode,
  initialTask,
  onClose,
  onSubmit,
  loading,
}: Omit<TaskFormModalProps, 'open' | 'columnTitle'>) {
  const [values, setValues] = useState<TaskFormValues>(() => getInitialValues(mode, initialTask))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!values.title.trim()) return
    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="-mt-2 space-y-4">
      <Input
        label="Title *"
        value={values.title}
        onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
        placeholder="What needs to happen next?"
        required
        autoFocus
      />
      <Textarea
        label="Description"
        value={values.description}
        onChange={e => setValues(v => ({ ...v, description: e.target.value }))}
        placeholder="Add context, links, owners, or acceptance notes."
        rows={3}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-300">Priority</label>
          <select
            value={values.priority}
            onChange={e => setValues(v => ({ ...v, priority: e.target.value as Priority }))}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-teal-400/25"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <Input
          label="Due date"
          type="date"
          value={values.dueDate}
          onChange={e => setValues(v => ({ ...v, dueDate: e.target.value }))}
          className="[color-scheme:dark]"
        />
      </div>
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={loading} disabled={!values.title.trim()}>
          {mode === 'edit' ? 'Save task' : 'Add task'}
        </Button>
      </div>
    </form>
  )
}

export function TaskFormModal({
  open,
  mode,
  initialTask,
  columnTitle,
  onClose,
  onSubmit,
  loading = false,
}: TaskFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit task' : 'New task'}
      description={
        mode === 'edit'
          ? 'Update this card with the latest context.'
          : columnTitle
            ? `Adding to "${columnTitle}"`
            : 'Add the work your team needs to track.'
      }
    >
      <TaskFormFields
        key={`${mode}-${initialTask?.id ?? columnTitle ?? 'new'}-${open}`}
        mode={mode}
        initialTask={initialTask}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={loading}
      />
    </Modal>
  )
}
