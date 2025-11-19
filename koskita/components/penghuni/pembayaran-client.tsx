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
import { Pembayaran } from '@prisma/client'
import { Upload, Plus, Calendar as CalendarIcon, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface PembayaranClientProps {
  initialPayments: Pembayaran[]
  penghuniId: string
  hargaSewa: number
}

export function PembayaranClient({ initialPayments, penghuniId, hargaSewa }: PembayaranClientProps) {
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
      // Simulate file upload and get URL
      // In a real app, upload to S3/Cloudinary here
      const fakeUrl = `https://fake-storage.com/bukti/${Date.now()}.jpg`
      
      const result = await createPayment({
        penghuniId,
        bulan: new Date(bulan + '-01'), // Add day to make it a valid date
        jumlah: parseInt(jumlah),
        buktiURL: fakeUrl
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Riwayat Pembayaran</h1>
          <p className="text-slate-500 mt-2">Kelola dan upload bukti pembayaran sewa</p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
        {payments.map((payment) => (
          <Card key={payment.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status={payment.status} />
                <span className="text-xs text-slate-400">
                  {format(new Date(payment.createdAt), 'dd MMM yyyy', { locale: id })}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                {format(new Date(payment.bulan), 'MMMM yyyy', { locale: id })}
              </CardTitle>
              <CardDescription>
                Pembayaran Sewa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <span className="text-sm font-normal text-slate-500">Rp</span>
                {payment.jumlah.toLocaleString('id-ID')}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full text-xs h-8" asChild>
                <a href={payment.buktiURL || '#'} target="_blank" rel="noopener noreferrer">
                  Lihat Bukti
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {payments.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Belum ada riwayat pembayaran.
          </div>
        )}
      </div>
    </div>
  )
}