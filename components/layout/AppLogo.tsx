import Link from 'next/link'
import { Layers } from 'lucide-react'

interface AppLogoProps {
  href?: string
}

export function AppLogo({ href = '/dashboard' }: AppLogoProps) {
  const inner = (
    <div className="flex items-center gap-2.5 group">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
        <div className="w-full h-full rounded-[11px] bg-[#0a0a0f] flex items-center justify-center">
          <Layers size={17} className="text-violet-300" strokeWidth={2.25} />
        </div>
      </div>
      <div className="hidden sm:block">
        <span className="font-bold text-white tracking-tight text-[15px]">Taskflow</span>
        <span className="block text-[10px] text-zinc-500 font-medium -mt-0.5">Kanban workspace</span>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {inner}
      </Link>
    )
  }
  return inner
}
