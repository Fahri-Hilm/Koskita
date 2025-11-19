'use client'

import { useState } from 'react'
import { OwnerLayout } from '@/components/layout/owner-layout'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { RoomCard } from '@/components/shared/room-card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FloatLabelInput } from '@/components/ui/float-label-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'

export default function KamarPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Dummy data
  type Room = {
    id: number
    nomor: string
    tipe: string
    harga: number
    status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE'
    penghuni?: string
  }

  const rooms: Room[] = [
    { id: 1, nomor: '101', tipe: 'AC', harga: 1500000, status: 'TERISI', penghuni: 'Budi Santoso' },
    { id: 2, nomor: '102', tipe: 'Non-AC', harga: 800000, status: 'KOSONG' },
    { id: 3, nomor: '103', tipe: 'Premium', harga: 2000000, status: 'MAINTENANCE' },
    { id: 4, nomor: '104', tipe: 'AC', harga: 1500000, status: 'AKAN_KOSONG', penghuni: 'Siti Aminah' },
  ]

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
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
              <form className="space-y-4 mt-4">
                <FloatLabelInput label="Nomor Kamar" placeholder="Contoh: 101" />
                
                <div className="space-y-2">
                  <Label>Tipe Kamar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">AC</SelectItem>
                      <SelectItem value="non-ac">Non AC</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <FloatLabelInput label="Harga Sewa (Bulanan)" type="number" />
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
                  <Button type="submit" className="bg-indigo-600 text-white">Simpan</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              nomorKamar={room.nomor}
              tipe={room.tipe}
              harga={room.harga}
              status={room.status}
              penghuniName={room.penghuni}
              onDetail={() => console.log('Detail', room.id)}
            />
          ))}
        </div>
      </div>
    </OwnerLayout>
  )
}