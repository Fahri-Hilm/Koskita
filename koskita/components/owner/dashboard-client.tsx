'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BedDouble, Users, Wallet, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalRooms: number
  emptyRooms: number
  activeTenants: number
  revenue: number
  pendingComplaints: number
}

interface DashboardClientProps {
  stats: DashboardStats
}

export function DashboardClient({ stats }: DashboardClientProps) {
  const statCards = [
    {
      title: 'Total Kamar',
      value: stats.totalRooms.toString(),
      desc: `${stats.emptyRooms} Kosong`,
      icon: BedDouble,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Penghuni',
      value: stats.activeTenants.toString(),
      desc: 'Aktif saat ini',
      icon: Users,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Pendapatan',
      value: `Rp ${stats.revenue.toLocaleString('id-ID')}`,
      desc: 'Bulan ini',
      icon: Wallet,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      title: 'Pengaduan',
      value: stats.pendingComplaints.toString(),
      desc: 'Perlu tindakan',
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Selamat datang kembali, Owner!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-xs text-slate-500 mt-1">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}