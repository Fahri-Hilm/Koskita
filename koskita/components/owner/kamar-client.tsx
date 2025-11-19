'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FloatLabelInput } from '@/components/ui/float-label-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Plus, Search, Filter } from 'lucide-react'
import { RoomCard } from '@/components/shared/room-card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { createRoom, deleteRoom } from '@/lib/actions/room.actions'
import { Kamar } from '@prisma/client'

type RoomWithPenghuni = Kamar & {
  penghuni?: { namaLengkap: string } | null
}

interface KamarClientProps {
  initialRooms: RoomWithPenghuni[]
  ownerId: string
}

export function KamarClient({ initialRooms, ownerId }: KamarClientProps) {
  const [rooms, setRooms] = useState<RoomWithPenghuni[]>(initialRooms)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  // Form State
  const [formData, setFormData] = useState({
    nomorKamar: '',
    tipe: 'AC',
    hargaSewa: '',
    fasilitas: ''
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createRoom({
        nomorKamar: formData.nomorKamar,
        tipe: formData.tipe as 'AC' | 'NON_AC' | 'PREMIUM',
        hargaSewa: parseInt(formData.hargaSewa),
        fasilitas: formData.fasilitas.split(',').map(f => f.trim()).filter(f => f)
      }, ownerId)

      if (result.success && result.data) {
        toast.success('Kamar berhasil ditambahkan')
        setIsAddOpen(false)
        setFormData({ nomorKamar: '', tipe: 'AC', hargaSewa: '', fasilitas: '' })
        // Update local state
        setRooms([...rooms, result.data as RoomWithPenghuni])
      } else {
        toast.error(result.error || 'Gagal menambahkan kamar')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini?')) return

    const result = await deleteRoom(id)
    if (result.success) {
      toast.success('Kamar berhasil dihapus')
      setRooms(rooms.filter(r => r.id !== id))
    } else {
      toast.error(result.error || 'Gagal menghapus kamar')
    }
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.nomorKamar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.tipe.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'ALL' || room.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manajemen Kamar</h1>
          <p className="text-slate-500 mt-2">Kelola daftar kamar dan statusnya</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Tambah Kamar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kamar Baru</DialogTitle>
              <DialogDescription>
                Masukkan detail kamar baru yang akan disewakan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <FloatLabelInput 
                label="Nomor Kamar" 
                id="nomor"
                value={formData.nomorKamar}
                onChange={(e) => setFormData({...formData, nomorKamar: e.target.value})}
                required
              />
              
              <div className="space-y-2">
                <Label>Tipe Kamar</Label>
                <Select 
                  value={formData.tipe} 
                  onValueChange={(val) => setFormData({...formData, tipe: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AC">Tipe AC</SelectItem>
                    <SelectItem value="NON_AC">Non AC</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FloatLabelInput 
                label="Harga Sewa (per bulan)" 
                id="harga"
                type="number"
                value={formData.hargaSewa}
                onChange={(e) => setFormData({...formData, hargaSewa: e.target.value})}
                required
              />

              <div className="space-y-2">
                <Label>Fasilitas (pisahkan dengan koma)</Label>
                <Input 
                  placeholder="Contoh: Kasur, Lemari, Meja"
                  value={formData.fasilitas}
                  onChange={(e) => setFormData({...formData, fasilitas: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-indigo-600 text-white" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Kamar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari nomor kamar..." 
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
              <SelectItem value="KOSONG">Kosong</SelectItem>
              <SelectItem value="TERISI">Terisi</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <RoomCard 
            key={room.id}
            nomorKamar={room.nomorKamar}
            tipe={room.tipe}
            harga={room.hargaSewa}
            status={room.status}
            penghuniName={room.penghuni?.namaLengkap}
            onDelete={() => handleDelete(room.id)}
            onEdit={() => {
              // Implement edit logic here if needed
              toast.info('Fitur edit akan segera hadir')
            }}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          Tidak ada kamar yang ditemukan.
        </div>
      )}
    </div>
  )
}