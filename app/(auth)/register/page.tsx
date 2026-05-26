'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'


function getPasswordScore(password: string) {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  return score
}

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)

  const passwordScore = useMemo(() => getPasswordScore(password), [password])
  const passwordsMatch = !confirmPassword || password === confirmPassword
  const canSubmit = fullName.trim() && email.trim() && password.length >= 6 && passwordsMatch && acceptedTerms

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      notify.warning('Check the form', 'Add your name, match your passwords, and accept the terms.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (error) {
      notify.error('Unable to create account', error.message)
      setLoading(false)
      return
    }

    notify.success('Account created', 'Your workspace is ready.')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthShell
      mode="register"
      title="Create your workspace"
      subtitle="Start with a focused Kanban system that scales from one project to a full operating rhythm."
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-teal-400 hover:text-teal-300">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Full name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Maya Santoso"
          required
          autoComplete="name"
          icon={<UserRound size={16} />}
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
          autoComplete="email"
          icon={<Mail size={16} />}
        />
        <div>
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Create a secure password"
            required
            minLength={6}
            autoComplete="new-password"
            icon={<LockKeyhole size={16} />}
          />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className={cn(
                'h-full rounded-full',
                passwordScore <= 1 && 'bg-red-400',
                passwordScore === 2 && 'bg-amber-400',
                passwordScore === 3 && 'bg-sky-400',
                passwordScore >= 4 && 'bg-teal-400',
              )}
              animate={{ width: `${Math.max(passwordScore, password ? 1 : 0) * 25}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">Use 8+ characters with a mix of letters, numbers, and symbols.</p>
        </div>
        <Input
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Repeat your password"
          required
          autoComplete="new-password"
          error={passwordsMatch ? undefined : 'Passwords must match.'}
          icon={<LockKeyhole size={16} />}
        />

        <label className="flex items-start gap-3 text-sm leading-5 text-zinc-400">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={e => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/15 bg-white/[0.04] accent-teal-400"
            required
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!canSubmit}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
