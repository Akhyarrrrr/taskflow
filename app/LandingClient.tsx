'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, Zap, Shield, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppLogo } from '@/components/layout/AppLogo'
import { cn } from '@/lib/utils/cn'

const cards = [
  { title: 'Shape onboarding flow', meta: 'Design', tone: 'from-teal-400 to-teal-300', x: 0, delay: 0 },
  { title: 'Review launch blockers', meta: 'Ops', tone: 'from-orange-400 to-orange-300', x: 28, delay: 0.12 },
  { title: 'Ship billing polish', meta: 'Product', tone: 'from-teal-300 to-teal-500', x: -18, delay: 0.24 },
]

export default function LandingClient() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="bg-app-gradient min-h-screen text-slate-50 selection:bg-teal-500/30 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#05060a]/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <AppLogo href="/" size="sm" />
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-teal-500 to-teal-400 text-slate-950 border-none hover:from-teal-400 hover:to-teal-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm text-teal-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500"></span>
            </span>
            Premium Experience
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl"
          >
            Manage tasks with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
              extraordinary focus
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-slate-400 md:text-xl"
          >
            A premium Kanban workspace designed for those who value speed, aesthetics, and flawless execution. Drop the clutter. Get things done.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 hover:to-teal-300 text-slate-950 border-none shadow-lg shadow-teal-500/25">
                Start for free <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-32 grid gap-6 md:grid-cols-3"
        >
          <div className="spotlight-card rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:col-span-2 relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Lightning Fast Interactions</h3>
            <p className="text-slate-400 mb-8 max-w-md relative z-10">Optimized drag and drop mechanics powered by dnd-kit. Move tasks effortlessly across your workflow without dropping a frame.</p>
            
            <div className="h-48 w-full rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] to-transparent z-10" />
              <div className="flex gap-4 p-4">
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-40 h-28 rounded-lg bg-white/5 border border-white/10 shadow-lg" 
                />
                <motion.div 
                  animate={{ y: [-10, -15, -10] }} 
                  transition={{ duration: 4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-40 h-28 rounded-lg bg-teal-500/10 border border-teal-500/30 shadow-lg shadow-teal-500/20 rotate-[4deg]" 
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-40 h-28 rounded-lg bg-white/5 border border-white/10 shadow-lg" 
                />
              </div>
            </div>
          </div>

          <div className="spotlight-card rounded-3xl border border-white/10 bg-white/[0.02] p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Row-Level Security</h3>
            <p className="text-slate-400">Backed by Supabase. Your boards, columns, and tasks are securely isolated and strictly yours.</p>
            <ul className="mt-8 space-y-3">
              {['PostgreSQL Database', 'Instant Auth', 'Encrypted Data'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-teal-400 mr-3" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/10 bg-[#05060a]/80 py-12 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-2">
            <AppLogo href="/" size="sm" />
            <span className="text-lg font-bold tracking-tight">TaskFlow</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved. Built for focus.
          </p>
        </div>
      </footer>
    </div>
  )
}
