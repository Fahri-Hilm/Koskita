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
import { uploadImage } from '@/lib/actions/upload.actions'
import { Pengaduan } from '@prisma/client'
import { MessageSquare, Plus, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { motion } from 'framer-motion'

interface PengaduanClientProps {
  initialComplaints: Pengaduan[]
}

export function PengaduanClient({ initialComplaints }: PengaduanClientProps) {
  const [complaints, setComplaints] = useState<Pengaduan[]>(initialComplaints)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [fotoFile, setFotoFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      let fotoURL = ''
      if (fotoFile) {
        const formData = new FormData()
        formData.append('file', fotoFile)
        fotoURL = await uploadImage(formData)
      }

      const result = await createComplaint({
        judul,
        deskripsi,
        fotoURL
      })

      if (result.success && result.data) {
        toast.success('Pengaduan berhasil dikirim')
        setComplaints([result.data, ...complaints])
        setIsAddOpen(false)
        setJudul('')
        setDeskripsi('')
        setFotoFile(null)
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Pengaduan 📢
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Laporkan masalah atau keluhan Anda, kami siap membantu!</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-rose-500/30 transition-all hover:scale-105">
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

              <div className="space-y-2">
                <Label htmlFor="foto">Foto Bukti (Opsional)</Label>
                <Input 
                  id="foto" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
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
        {complaints.map((complaint, index) => (
          <motion.div
            key={complaint.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-slate-200/60 hover:shadow-xl hover:shadow-rose-100/50 transition-all hover:-translate-y-1 bg-white/50 backdrop-blur-sm group h-full flex flex-col">
              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <StatusBadge status={complaint.status} />
                  <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                    {format(new Date(complaint.createdAt), 'dd MMM', { locale: id })}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-rose-600 transition-colors">
                  {complaint.judul}
                </CardTitle>
                <CardDescription className="line-clamp-3 mt-2 text-slate-600">
                  {complaint.deskripsi}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 mt-auto border-t border-slate-100/50 p-4 bg-slate-50/30">
                <div className="flex items-center text-xs font-medium text-slate-500 w-full">
                  {complaint.status === 'BARU' ? (
                    <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-full">
                      <AlertCircle className="w-3 h-3 mr-2" /> Menunggu respon owner
                    </div>
                  ) : complaint.status === 'DIPROSES' ? (
                    <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md w-full">
                      <MessageSquare className="w-3 h-3 mr-2" /> Sedang ditangani
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md w-full">
                      <CheckCircle2 className="w-3 h-3 mr-2" /> Masalah selesai
                    </div>
                  )}
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
        {complaints.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 flex flex-col items-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-rose-300" />
            </div>
            <p>Belum ada pengaduan yang dibuat. Aman terkendali! 👍</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}