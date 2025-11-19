'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'
import { verifyPayment } from '@/lib/actions/payment.actions'
import { Pembayaran } from '@prisma/client'
import Image from 'next/image'

type PaymentWithRelations = Pembayaran & {
  penghuni: {
    namaLengkap: string
    kamar: { nomorKamar: string }
  }
}

interface PembayaranClientProps {
  initialPayments: PaymentWithRelations[]
}

export function PembayaranClient({ initialPayments }: PembayaranClientProps) {
  const [payments, setPayments] = useState<PaymentWithRelations[]>(initialPayments)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithRelations | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleVerify = async (id: string, status: 'DIVERIFIKASI' | 'DITOLAK') => {
    const result = await verifyPayment(id, status)
    if (result.success) {
      toast.success(`Pembayaran berhasil ${status === 'DIVERIFIKASI' ? 'diverifikasi' : 'ditolak'}`)
      setPayments(payments.map(p => p.id === id ? { ...p, status } : p))
      setIsDetailOpen(false)
    } else {
      toast.error(result.error || 'Gagal memverifikasi pembayaran')
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.penghuni.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          payment.penghuni.kamar.nomorKamar.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'ALL' || payment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Riwayat Pembayaran</h1>
        <p className="text-slate-500 mt-2">Verifikasi dan pantau pembayaran sewa</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari nama atau nomor kamar..." 
            className="pl-9 border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DIVERIFIKASI">Diverifikasi</SelectItem>
              <SelectItem value="DITOLAK">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>Bulan Sewa</TableHead>
              <TableHead>Jumlah</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-slate-50/50">
                <TableCell>{new Date(payment.createdAt).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="font-medium">{payment.penghuni.namaLengkap}</TableCell>
                <TableCell>#{payment.penghuni.kamar.nomorKamar}</TableCell>
                <TableCell>{new Date(payment.bulan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</TableCell>
                <TableCell>Rp {payment.jumlah.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedPayment(payment)
                      setIsDetailOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Tidak ada data pembayaran.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pembayaran</DialogTitle>
            <DialogDescription>
              Verifikasi bukti transfer pembayaran.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4 mt-4">
              <div className="aspect-video relative bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                {selectedPayment.buktiURL ? (
                  <Image 
                    src={selectedPayment.buktiURL} 
                    alt="Bukti Transfer" 
                    fill
                    className="object-contain"
                  />
                ) : (
                  <span className="text-slate-400">Tidak ada bukti transfer</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Penghuni</p>
                  <p className="font-medium">{selectedPayment.penghuni.namaLengkap}</p>
                </div>
                <div>
                  <p className="text-slate-500">Kamar</p>
                  <p className="font-medium">#{selectedPayment.penghuni.kamar.nomorKamar}</p>
                </div>
                <div>
                  <p className="text-slate-500">Jumlah</p>
                  <p className="font-medium">Rp {selectedPayment.jumlah.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Tanggal Upload</p>
                  <p className="font-medium">{new Date(selectedPayment.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              {selectedPayment.status === 'PENDING' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleVerify(selectedPayment.id, 'DITOLAK')}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Tolak
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleVerify(selectedPayment.id, 'DIVERIFIKASI')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Verifikasi
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}