'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'
import { createPayment } from '@/lib/actions/payment.actions'
import { uploadImage } from '@/lib/actions/upload.actions'
import { Pembayaran } from '@prisma/client'
import { Upload, Plus, Calendar as CalendarIcon, DollarSign, CreditCard, Wallet } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface PembayaranClientProps {
  initialPayments: Pembayaran[]
  hargaSewa: number
}

export function PembayaranClient({ initialPayments, hargaSewa }: PembayaranClientProps) {
  const [payments, setPayments] = useState<Pembayaran[]>(initialPayments)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [bulan, setBulan] = useState<string>(new Date().toISOString().slice(0, 7)) // YYYY-MM
  const [jumlah, setJumlah] = useState<string>(hargaSewa.toString())
  const [buktiFile, setBuktiFile] = useState<File | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!buktiFile) {
      toast.error('Mohon pilih file bukti pembayaran')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', buktiFile)
      const buktiUrl = await uploadImage(formData)
      
      const result = await createPayment({
        bulan: new Date(bulan + '-01'), // Add day to make it a valid date
        jumlah: parseInt(jumlah),
        buktiURL: buktiUrl
      })

      if (result.success && result.data) {
        toast.success('Bukti pembayaran berhasil diupload')
        setPayments([result.data, ...payments])
        setIsUploadOpen(false)
        setBuktiFile(null)
      } else {
        toast.error(result.error || 'Gagal upload pembayaran')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Riwayat Pembayaran 💸
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Kelola dan upload bukti pembayaran sewa dengan mudah</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:scale-105">
              <Plus className="w-4 h-4 mr-2" /> Upload Bukti
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
              <DialogDescription>
                Upload foto bukti transfer untuk bulan yang dipilih.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="bulan">Bulan Sewa</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    id="bulan" 
                    type="month" 
                    className="pl-9"
                    value={bulan}
                    onChange={(e) => setBulan(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jumlah">Jumlah Transfer</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Rp</span>
                  <Input 
                    id="jumlah" 
                    type="number" 
                    className="pl-9"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bukti">Foto Bukti</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    id="bukti" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => setBuktiFile(e.target.files?.[0] || null)}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-sm text-slate-600">
                      {buktiFile ? buktiFile.name : 'Klik untuk upload foto'}
                    </span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-600" disabled={isLoading}>
                {isLoading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200/60 hover:shadow-xl hover:shadow-emerald-100/50 transition-all hover:-translate-y-1 bg-white/50 backdrop-blur-sm group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <StatusBadge status={payment.status} />
                  <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                    {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: id })}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {format(new Date(payment.bulan), 'MMMM yyyy', { locale: id })}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Pembayaran Sewa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1 text-3xl font-extrabold text-slate-900">
                  <span className="text-sm font-medium text-slate-500">Rp</span>
                  {payment.jumlah.toLocaleString('id-ID')}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full text-xs h-9 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" asChild>
                  <a href={payment.buktiURL || '#'} target="_blank" rel="noopener noreferrer">
                    Lihat Bukti Transfer 🧾
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        {payments.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-emerald-300" />
            </div>
            <p>Belum ada riwayat pembayaran.</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}