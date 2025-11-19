'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Filter, CheckCircle, Clock, MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from '@/components/shared/status-badge'
import { toast } from 'sonner'
import { updateComplaintStatus } from '@/lib/actions/complaint.actions'
import { Pengaduan } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type ComplaintWithRelations = Pengaduan & {
  penghuni: {
    namaLengkap: string
    kamar: { nomorKamar: string }
  }
}

interface PengaduanClientProps {
  initialComplaints: ComplaintWithRelations[]
}

export function PengaduanClient({ initialComplaints }: PengaduanClientProps) {
  const [complaints, setComplaints] = useState<ComplaintWithRelations[]>(initialComplaints)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const handleStatusUpdate = async (id: string, status: 'DIPROSES' | 'SELESAI') => {
    const result = await updateComplaintStatus(id, status)
    if (result.success) {
      toast.success(`Status pengaduan diperbarui menjadi ${status}`)
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c))
    } else {
      toast.error(result.error || 'Gagal mengupdate status')
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          complaint.penghuni.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          complaint.penghuni.kamar.nomorKamar.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'ALL' || complaint.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Daftar Pengaduan</h1>
        <p className="text-slate-500 mt-2">Kelola laporan dan keluhan penghuni</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari judul, nama, atau kamar..." 
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
              <SelectItem value="BARU">Baru</SelectItem>
              <SelectItem value="DIPROSES">Diproses</SelectItem>
              <SelectItem value="SELESAI">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status={complaint.status} />
                <span className="text-xs text-slate-400">
                  {new Date(complaint.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-1">
                {complaint.judul}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {complaint.deskripsi}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <Avatar className="h-8 w-8 bg-indigo-50 text-indigo-600">
                  <AvatarFallback>{complaint.penghuni.namaLengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-slate-900">{complaint.penghuni.namaLengkap}</p>
                  <p className="text-xs text-slate-500">Kamar #{complaint.penghuni.kamar.nomorKamar}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 gap-2">
              {complaint.status === 'BARU' && (
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => handleStatusUpdate(complaint.id, 'DIPROSES')}
                >
                  <Clock className="w-4 h-4 mr-2" /> Proses
                </Button>
              )}
              {complaint.status === 'DIPROSES' && (
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleStatusUpdate(complaint.id, 'SELESAI')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> Selesai
                </Button>
              )}
              {complaint.status === 'SELESAI' && (
                <Button variant="outline" className="w-full" disabled>
                  <CheckCircle className="w-4 h-4 mr-2" /> Sudah Selesai
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
        {filteredComplaints.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Tidak ada pengaduan yang ditemukan.
          </div>
        )}
      </div>
    </div>
  )
}