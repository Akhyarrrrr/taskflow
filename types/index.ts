// types/index.ts

export type Priority = 'low' | 'medium' | 'high'

export interface Board {
  id: string
  user_id: string
  title: string
  description: string | null
  cover_color?: string | null
  created_at: string
}

export interface UserProfile {
  email: string
  displayName: string
  avatarUrl?: string | null
}

export interface Column {
  id: string
  board_id: string
  title: string
  position: number
  color: string
  created_at: string
  tasks?: Task[]
}

export interface Task {
  id: string
  column_id: string
  user_id: string
  title: string
  description: string | null
  priority: Priority
  due_date: string | null
  position: number
  created_at: string
}
