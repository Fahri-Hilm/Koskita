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
    { icon: Wallet, label: 'Keuangan', href: '/owner/keuangan/pembayaran' },
    { icon: MessageSquare, label: 'Pengaduan', href: '/owner/pengaduan' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 fixed h-full z-20 hidden md:flex flex-col"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <span className="text-2xl font-bold text-indigo-600">KOSKITA</span>
          ) : (
            <span className="text-2xl font-bold text-indigo-600">K</span>
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
                      ? "bg-indigo-50 text-indigo-600 font-medium" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive && "text-indigo-600")} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50",
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
      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600">KOSKITA</span>
        <Button variant="ghost" size="icon">
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 p-6 md:p-8 mt-16 md:mt-0 transition-all duration-300",
          isSidebarOpen ? "md:ml-[280px]" : "md:ml-[80px]"
        )}
      >
        {children}
      </main>
    </div>
  )
}