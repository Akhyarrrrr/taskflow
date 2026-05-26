import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to TaskFlow and return to your Kanban workspace.',
  openGraph: {
    title: 'Sign In - TaskFlow',
    description: 'Access your premium Kanban workspace.',
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
