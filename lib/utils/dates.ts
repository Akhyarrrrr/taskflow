/** Start of local calendar day for date comparisons */
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false
  return startOfDay(new Date(dueDate)) < startOfDay(new Date())
}

export function isDueTomorrow(dueDate: string | null): boolean {
  if (!dueDate) return false
  const tomorrow = startOfDay(new Date())
  tomorrow.setDate(tomorrow.getDate() + 1)
  return startOfDay(new Date(dueDate)).getTime() === tomorrow.getTime()
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false
  return startOfDay(new Date(dueDate)).getTime() === startOfDay(new Date()).getTime()
}

export function formatDueDate(dueDate: string): string {
  return new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
