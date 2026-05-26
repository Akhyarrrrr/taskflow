'use client'

import { motion } from 'framer-motion'

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-[#05060a]" />
      <div
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 75% 62% at 50% 0%, black 22%, transparent 72%)',
        }}
      />
      <motion.div
        className="absolute -top-40 left-[18%] h-[34rem] w-[34rem] rounded-full bg-emerald-500/16 blur-[130px]"
        animate={{ x: [0, 34, 0], y: [0, 24, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[22%] -right-28 h-[30rem] w-[30rem] rounded-full bg-sky-500/14 blur-[120px]"
        animate={{ x: [0, -28, 0], y: [0, 36, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,0.42) 0 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, transparent 72%)',
        }}
      />
    </div>
  )
}
