import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Toaster } from '@/components/providers/Toaster'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Taskflow — Kanban yang elegan untuk tim modern',
  description:
    'Atur pekerjaan dengan board visual, drag-and-drop, prioritas, dan deadline — dibangun dengan Next.js & Supabase.',
  openGraph: {
    title: 'Taskflow',
    description: 'Kanban board modern untuk produktivitas',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
