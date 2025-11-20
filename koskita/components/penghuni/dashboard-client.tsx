'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { Calendar, Wifi, Wind, AlertCircle, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Penghuni, Kamar, Pembayaran } from '@prisma/client'
import { format, isSameMonth, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

type TenantWithRelations = Penghuni & {
  kamar: Kamar | null
  pembayaran: Pembayaran[]
}

interface DashboardClientProps {
  tenant: TenantWithRelations
}

export function DashboardClient({ tenant }: DashboardClientProps) {
  const currentDate = new Date()
  const currentMonthPayment = tenant.pembayaran.find(p => 
    isSameMonth(new Date(p.bulan), currentDate)
  )

  const paymentStatus = currentMonthPayment?.status || 'BELUM_BAYAR'
  const isPaid = paymentStatus === 'LUNAS' || paymentStatus === 'DIVERIFIKASI'
  
  // Calculate paid months for the current year
  const currentYear = currentDate.getFullYear()
  const paidMonths = tenant.pembayaran
    .filter(p => 
      new Date(p.bulan).getFullYear() === currentYear && 
      (p.status === 'LUNAS' || p.status === 'DIVERIFIKASI')
    )
    .map(p => new Date(p.bulan).getMonth())

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Halo, {tenant.namaLengkap.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kamar {tenant.kamar?.nomorKamar || '-'} • {tenant.kamar?.tipe || '-'}
          </p>
        </div>
        <div className="hidden md:block">
          <StatusBadge status={tenant.statusSewa} />
        </div>
      </div>

      {/* Payment Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2 relative z-10">
            <CardDescription className="text-indigo-100 dark:text-indigo-200">Tagihan Bulan Ini</CardDescription>
            <CardTitle className="text-3xl font-bold">
              Rp {tenant.kamar?.hargaSewa.toLocaleString('id-ID') || 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              {isPaid ? (
                <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full text-sm font-medium text-green-100 border border-green-500/30">
                  <CheckCircle className="w-4 h-4" /> Lunas
                </div>
              ) : paymentStatus === 'PENDING' ? (
                <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full text-sm font-medium text-orange-100 border border-orange-500/30">
                  <Clock className="w-4 h-4" /> Menunggu Verifikasi
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full text-sm font-medium text-red-100 border border-red-500/30">
                  <AlertCircle className="w-4 h-4" /> Belum Dibayar
                </div>
              )}
              <span className="text-indigo-200 dark:text-indigo-300 text-sm">
                Jatuh tempo: 10 {format(currentDate, 'MMM yyyy', { locale: id })}
              </span>
            </div>
            
            {!isPaid && paymentStatus !== 'PENDING' && (
              <Button asChild className="w-full bg-white text-indigo-600 hover:bg-indigo-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 border-none shadow-lg">
                <Link href="/penghuni/pembayaran">
                  Bayar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History Visualization */}
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-lg dark:text-white">Riwayat Pembayaran {currentYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10" />
            
            {months.map((month, index) => {
              const isPast = index <= currentDate.getMonth()
              const isPaidMonth = paidMonths.includes(index)
              
              return (
                <div key={month} className="flex flex-col items-center gap-2">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                    ${isPaidMonth ? 'bg-green-100 text-green-600 border-2 border-green-500 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500' : 
                      isPast ? 'bg-slate-100 text-slate-400 border-2 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' : 
                      'bg-white text-slate-300 border-2 border-slate-100 dark:bg-slate-900 dark:text-slate-700 dark:border-slate-800'}
                  `}>
                    {isPaidMonth ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs ${isPast ? 'text-slate-600 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                    {month}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Fasilitas Kamar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              {tenant.kamar?.tipe === 'AC' && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Wind className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <span>AC</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Wifi className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <span>WiFi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Masa Sewa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span>
                Check-in: {format(new Date(tenant.tanggalCheckIn), 'dd MMM yyyy', { locale: id })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}