'use client'

import { PenghuniLayout } from '@/components/layout/penghuni-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentProgressBar } from '@/components/shared/payment-progress-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { Calendar, Wifi, Wind, AlertCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function PenghuniDashboard() {
  // Dummy data
  const tenantData = {
    name: 'Budi Santoso',
    room: '101',
    type: 'AC',
    price: 1500000,
    dueDate: '25 Nov 2025',
    paymentStatus: 'PENDING',
    paidMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Jan-Oct paid
    currentMonth: 11 // November
  }

  return (
    <PenghuniLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Halo, {tenantData.name.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500 text-sm">Kamar {tenantData.room} • {tenantData.type}</p>
          </div>
          <div className="hidden md:block">
            <StatusBadge status="AKTIF" />
          </div>
        </div>

        {/* Payment Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <CardHeader className="pb-2 relative z-10">
              <CardDescription className="text-indigo-100">Tagihan Bulan Ini</CardDescription>
              <CardTitle className="text-3xl font-bold">Rp {tenantData.price.toLocaleString('id-ID')}</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-100 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>Jatuh tempo: {tenantData.dueDate}</span>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={tenantData.paymentStatus as any} className="bg-white/20 text-white border-white/20 backdrop-blur-sm" />
              </div>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Button asChild className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                <Link href="/penghuni/pembayaran">
                  Bayar Sekarang <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Payment Progress */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentProgressBar 
              currentMonth={tenantData.currentMonth} 
              paidMonths={tenantData.paidMonths} 
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/penghuni/pengaduan">
            <Card className="border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Lapor Masalah</h3>
                  <p className="text-xs text-slate-500">AC rusak, air mati, dll</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/penghuni/akun">
            <Card className="border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Info WiFi</h3>
                  <p className="text-xs text-slate-500">Password & detail jaringan</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </PenghuniLayout>
  )
}