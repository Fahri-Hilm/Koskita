'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  BedDouble, 
  Wallet, 
  MessageSquare, 
  LogOut, 
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

import { NotificationBell } from '@/components/layout/notification-bell'
import { ModeToggle } from '@/components/mode-toggle'

interface OwnerLayoutProps {
  children: React.ReactNode
}

export function OwnerLayout({ children }: OwnerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/owner/dashboard' },
    { icon: BedDouble, label: 'Kamar', href: '/owner/kamar' },
    { icon: Users, label: 'Penghuni', href: '/owner/penghuni' },
    { icon: Wallet, label: 'Keuangan', href: '/owner/pembayaran' },
    { icon: MessageSquare, label: 'Pengaduan', href: '/owner/pengaduan' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-20 hidden md:flex flex-col"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">KOSKITA</span>
          ) : (
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">K</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium" 
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-indigo-600 dark:text-indigo-400")} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {isSidebarOpen && (
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">Tema</span>
              <ModeToggle />
            </div>
          )}
          {!isSidebarOpen && (
            <div className="flex justify-center mb-2">
              <ModeToggle />
            </div>
          )}
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
              !isSidebarOpen && "justify-center px-0"
            )}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Keluar</span>}
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-20 px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">KOSKITA</span>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <NotificationBell />
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 p-6 md:p-8 mt-16 md:mt-0 transition-all duration-300",
          isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"
        )}
      >
        {/* Desktop Header with Notification */}
        <div className="hidden md:flex justify-end mb-6">
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  )
}