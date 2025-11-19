'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search, MoreVertical, FileText, Trash, UserX } from 'lucide-react'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from '@/components/shared/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FloatLabelInput } from '@/components/ui/float-label-input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { createTenant, archiveTenant } from '@/lib/actions/tenant.actions'
import { Penghuni, Kamar } from '@prisma/client'

type TenantWithRelations = Penghuni & {
  kamar: Kamar
  user: { email: string }
}

interface PenghuniClientProps {
  initialTenants: TenantWithRelations[]
  availableRooms: Kamar[]
  ownerId: string
}

export function PenghuniClient({ initialTenants, availableRooms, ownerId }: PenghuniClientProps) {
  const [tenants, setTenants] = useState<TenantWithRelations[]>(initialTenants)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noIdentitas: '',
    noTelepon: '',
    alamatAsal: '',
    kamarId: '',
    tanggalCheckIn: new Date().toISOString().split('T')[0]
  })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createTenant({
        ...formData,
        tanggalCheckIn: new Date(formData.tanggalCheckIn)
      }, ownerId)

      if (result.success && result.data) {
        toast.success('Penghuni berhasil ditambahkan')
        setIsAddOpen(false)
        // Reset form
        setFormData({
          namaLengkap: '',
          email: '',
          noIdentitas: '',
          noTelepon: '',
          alamatAsal: '',
          kamarId: '',
          tanggalCheckIn: new Date().toISOString().split('T')[0]
        })
        // Update local state (simplified, ideally re-fetch or use result)
        // Since result.data is complex, we might just rely on revalidatePath and router.refresh()
        // But for now let's just reload the page to be safe or assume server action revalidates
        window.location.reload() 
      } else {
        toast.error(result.error || 'Gagal menambahkan penghuni')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleArchive = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menonaktifkan penghuni ini? Kamar akan menjadi kosong.')) return

    const result = await archiveTenant(id)
    if (result.success) {
      toast.success('Penghuni berhasil dinonaktifkan')
      setTenants(tenants.filter(t => t.id !== id))
    } else {
      toast.error(result.error || 'Gagal menonaktifkan penghuni')
    }
  }

  const filteredTenants = tenants.filter(tenant => 
    tenant.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.kamar.nomorKamar.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Daftar Penghuni</h1>
          <p className="text-slate-500 mt-2">Kelola data penghuni dan status sewa</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Tambah Penghuni
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Penghuni Baru</DialogTitle>
              <DialogDescription>
                Isi data lengkap penghuni baru. Password default: 123456
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FloatLabelInput 
                  label="Nama Lengkap" 
                  value={formData.namaLengkap}
                  onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                  required
                />
                <FloatLabelInput 
                  label="Email (untuk login)" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <FloatLabelInput 
                  label="No. KTP / Identitas" 
                  value={formData.noIdentitas}
                  onChange={(e) => setFormData({...formData, noIdentitas: e.target.value})}
                  required
                />
                <FloatLabelInput 
                  label="No. Telepon" 
                  value={formData.noTelepon}
                  onChange={(e) => setFormData({...formData, noTelepon: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Alamat Asal</Label>
                <Input 
                  value={formData.alamatAsal}
                  onChange={(e) => setFormData({...formData, alamatAsal: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Pilih Kamar</Label>
                  <Select 
                    value={formData.kamarId} 
                    onValueChange={(val) => setFormData({...formData, kamarId: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kamar kosong" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRooms.map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          Kamar {room.nomorKamar} - {room.tipe}
                        </SelectItem>
                      ))}
                      {availableRooms.length === 0 && (
                        <SelectItem value="none" disabled>Tidak ada kamar kosong</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tanggal Masuk</Label>
                  <Input 
                    type="date"
                    value={formData.tanggalCheckIn}
                    onChange={(e) => setFormData({...formData, tanggalCheckIn: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-indigo-600 text-white" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Data'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari nama atau nomor kamar..." 
              className="pl-9 border-slate-200 focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama Penghuni</TableHead>
              <TableHead>Kamar</TableHead>
              <TableHead>No. Telepon</TableHead>
              <TableHead>Tanggal Masuk</TableHead>
              <TableHead>Status Sewa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTenants.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 bg-indigo-100 text-indigo-600">
                      <AvatarFallback>{tenant.namaLengkap.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{tenant.namaLengkap}</p>
                      <p className="text-xs text-slate-500">{tenant.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-slate-900">#{tenant.kamar.nomorKamar}</span>
                </TableCell>
                <TableCell>{tenant.noTelepon}</TableCell>
                <TableCell>{new Date(tenant.tanggalCheckIn).toLocaleDateString('id-ID')}</TableCell>
                <TableCell>
                  <StatusBadge status={tenant.statusSewa} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <FileText className="w-4 h-4 mr-2" /> Detail Kontrak
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleArchive(tenant.id)}
                      >
                        <UserX className="w-4 h-4 mr-2" /> Non-aktifkan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredTenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  Tidak ada data penghuni.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}