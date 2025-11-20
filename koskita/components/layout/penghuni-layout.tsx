'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  CreditCard, 
  MessageSquare, 
  User,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

import { ModeToggle } from '@/components/mode-toggle'

interface PenghuniLayoutProps {
  children: React.ReactNode
}

export function PenghuniLayout({ children }: PenghuniLayoutProps) {
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: 'Home', href: '/penghuni/dashboard' },
    { icon: CreditCard, label: 'Bayar', href: '/penghuni/pembayaran' },
    { icon: MessageSquare, label: 'Lapor', href: '/penghuni/pengaduan' },
    { icon: User, label: 'Akun', href: '/penghuni/akun' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="hidden md:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 items-center justify-between sticky top-0 z-20">
        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">KOSKITA</span>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400",
                  pathname.startsWith(item.href) ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4 mr-2" /> Keluar
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 sticky top-0 z-20 flex justify-between items-center">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">KOSKITA</span>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-slate-500 dark:text-slate-400"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-20 px-6 py-2 flex justify-between items-center safe-area-bottom">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
                )}
              >
                <item.icon className="w-6 h-6" />
              </motion.div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}