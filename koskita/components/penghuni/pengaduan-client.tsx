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
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'
import { createComplaint } from '@/lib/actions/complaint.actions'
import { Pengaduan } from '@prisma/client'
import { MessageSquare, Plus, Image as ImageIcon } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

interface PengaduanClientProps {
  initialComplaints: Pengaduan[]
  penghuniId: string
}

export function PengaduanClient({ initialComplaints, penghuniId }: PengaduanClientProps) {
  const [complaints, setComplaints] = useState<Pengaduan[]>(initialComplaints)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await createComplaint({
        penghuniId,
        judul,
        deskripsi,
        // fotoURL: ... (optional)
      })

      if (result.success && result.data) {
        toast.success('Pengaduan berhasil dikirim')
        setComplaints([result.data, ...complaints])
        setIsAddOpen(false)
        setJudul('')
        setDeskripsi('')
      } else {
        toast.error(result.error || 'Gagal mengirim pengaduan')
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
          <h1 className="text-3xl font-bold text-slate-900">Pengaduan</h1>
          <p className="text-slate-500 mt-2">Laporkan masalah atau keluhan Anda</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Buat Pengaduan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Pengaduan Baru</DialogTitle>
              <DialogDescription>
                Sampaikan keluhan atau masalah fasilitas kamar Anda.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Masalah</Label>
                <Input 
                  id="judul" 
                  placeholder="Contoh: AC Bocor"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Detail</Label>
                <Textarea 
                  id="deskripsi" 
                  placeholder="Jelaskan masalahnya secara detail..."
                  className="min-h-[100px]"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600" disabled={isLoading}>
                {isLoading ? 'Mengirim...' : 'Kirim Pengaduan'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status={complaint.status} />
                <span className="text-xs text-slate-400">
                  {format(new Date(complaint.createdAt), 'dd MMM yyyy', { locale: id })}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                {complaint.judul}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {complaint.deskripsi}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <div className="flex items-center text-xs text-slate-500">
                <MessageSquare className="w-3 h-3 mr-1" />
                {complaint.status === 'BARU' ? 'Menunggu respon' : 
                 complaint.status === 'DIPROSES' ? 'Sedang ditangani' : 'Selesai'}
              </div>
            </CardFooter>
          </Card>
        ))}
        {complaints.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Belum ada pengaduan yang dibuat.
          </div>
        )}
      </div>
    </div>
  )
}