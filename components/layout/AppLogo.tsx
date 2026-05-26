import Image from 'next/image'
import Link from 'next/link'
import logo from '@/taskflow-logo.png'
import { cn } from '@/lib/utils/cn'

interface AppLogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

export function AppLogo({ href = '/dashboard', size = 'md', className }: AppLogoProps) {
  const inner = (
    <Image
      src={logo}
      alt="TaskFlow"
      width={48}
      height={48}
      priority
      className={cn('rounded-xl object-contain shadow-lg shadow-teal-500/10 transition-opacity', sizes[size], className)}
    />
  )

  if (!href) return inner

  return (
    <Link href={href} aria-label="TaskFlow home" className="inline-flex items-center hover:opacity-90 transition-opacity">
      {inner}
    </Link>
  )
}
