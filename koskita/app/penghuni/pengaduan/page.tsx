'use client'

import { useState } from 'react'
import { PenghuniLayout } from '@/components/layout/penghuni-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/shared/status-badge'
import { MessageSquare, Send, Wrench } from 'lucide-react'
import { toast } from 'sonner'

export default function PengaduanPage() {
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judul || !deskripsi) return

    setSubmitting(true)
    // Simulate submit
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Pengaduan berhasil dikirim', {
      description: 'Kami akan segera menindaklanjuti laporan Anda.'
    })
    setSubmitting(false)
    setJudul('')
    setDeskripsi('')
  }

  // Dummy history
  const history = [
    { 
      id: 1, 
      judul: 'AC Bocor', 
      desc: 'Air menetes dari unit indoor AC',
      status: 'PROSES', 
      tgl: '25 Oct 2025' 
    },
    { 
      id: 2, 
      judul: 'Lampu Kamar Mandi Mati', 
      desc: 'Mohon diganti bohlamnya',
      status: 'SELESAI', 
      tgl: '10 Sep 2025' 
    },
  ]

  return (
    <PenghuniLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pengaduan</h1>
          <p className="text-slate-500">Laporkan masalah fasilitas kamar atau kost</p>
        </div>

        {/* Form Section */}
        <Card className="border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-indigo-600 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Buat Laporan Baru
            </CardTitle>
            <CardDescription>
              Jelaskan masalah yang Anda alami secara detail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Masalah</Label>
                <Input 
                  id="judul"
                  placeholder="Contoh: Keran air patah" 
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Detail</Label>
                <Textarea 
                  id="deskripsi"
                  placeholder="Ceritakan detail masalahnya..." 
                  className="min-h-[100px]"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={submitting}
              >
                {submitting ? (
                  'Mengirim...'
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" /> Kirim Laporan
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Riwayat Pengaduan</h2>
          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 mt-1">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{item.judul}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{item.desc}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status as any} />
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                  <span>ID: #{item.id}</span>
                  <span>{item.tgl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PenghuniLayout>
  )
}