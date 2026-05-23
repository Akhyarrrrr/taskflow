'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { notify } from '@/lib/toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      notify.error('Gagal masuk', error.message)
      setLoading(false)
      return
    }

    notify.success('Selamat datang kembali!', 'Mengalihkan ke dashboard...')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthShell
      title="Masuk ke Taskflow"
      subtitle="Lanjutkan mengelola board dan task kamu"
      footer={
        <>
          Belum punya akun?{' '}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Daftar gratis
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="nama@email.com"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Masuk
        </Button>
      </form>
    </AuthShell>
  )
}
