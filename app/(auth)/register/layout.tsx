import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a TaskFlow workspace for personal planning, team projects, or focused work.',
  openGraph: {
    title: 'Create Account - TaskFlow',
    description: 'Start your premium Kanban workspace.',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
