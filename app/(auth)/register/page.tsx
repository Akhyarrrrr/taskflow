'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { notify } from '@/lib/toast'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    if (error) {
      notify.error('Gagal mendaftar', error.message)
      setLoading(false)
      return
    }

    notify.success('Akun berhasil dibuat!', 'Kamu akan diarahkan ke dashboard.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthShell
      title="Buat akun baru"
      subtitle="Mulai board Kanban pertamamu dalam hitungan detik"
      footer={
        <>
          Sudah punya akun?{' '}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium">
            Masuk
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
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
          placeholder="Minimal 6 karakter"
          required
          minLength={6}
          autoComplete="new-password"
          hint="Gunakan kombinasi huruf dan angka untuk keamanan lebih baik"
        />
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Daftar
        </Button>
      </form>
    </AuthShell>
  )
}
