'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Priority, Task } from '@/types'
import { cn } from '@/lib/utils/cn'

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

export function TaskFormModal({
  open,
  mode,
  initialTask,
  columnTitle,
  onClose,
  onSubmit,
  loading = false,
}: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(emptyValues)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initialTask) {
      setValues({
        title: initialTask.title,
        description: initialTask.description ?? '',
        priority: initialTask.priority,
        dueDate: initialTask.due_date ?? '',
      })
    } else {
      setValues(emptyValues)
    }
  }, [open, mode, initialTask])

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
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Edit task' : 'Task baru'}
      description={
        mode === 'edit'
          ? 'Perbarui detail kartu ini.'
          : columnTitle
            ? `Ditambahkan ke kolom «${columnTitle}»`
            : 'Isi detail task kamu.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 -mt-2">
        <Input
          label="Judul *"
          value={values.title}
          onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
          placeholder="Apa yang perlu dikerjakan?"
          required
          autoFocus
        />
        <Textarea
          label="Deskripsi"
          value={values.description}
          onChange={e => setValues(v => ({ ...v, description: e.target.value }))}
          placeholder="Konteks, link, atau catatan..."
          rows={3}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-300">Prioritas</label>
            <select
              value={values.priority}
              onChange={e => setValues(v => ({ ...v, priority: e.target.value as Priority }))}
              className="w-full h-11 px-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            >
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>
          <Input
            label="Deadline"
            type="date"
            value={values.dueDate}
            onChange={e => setValues(v => ({ ...v, dueDate: e.target.value }))}
            className="[color-scheme:dark]"
          />
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" className="flex-1" loading={loading} disabled={!values.title.trim()}>
            {mode === 'edit' ? 'Simpan' : 'Tambah task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
