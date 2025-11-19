'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search, MoreVertical, FileText, Trash, UserX, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
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
import { uploadImage } from '@/lib/actions/upload.actions'
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
    tanggalCheckIn: new Date().toISOString().split('T')[0],
    fotoKTP: ''
  })
  const [ktpFile, setKtpFile] = useState<File | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let ktpUrl = ''
      if (ktpFile) {
        const formDataUpload = new FormData()
        formDataUpload.append('file', ktpFile)
        ktpUrl = await uploadImage(formDataUpload)
      }

      const result = await createTenant({
        ...formData,
        fotoKTP: ktpUrl,
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
          tanggalCheckIn: new Date().toISOString().split('T')[0],
          fotoKTP: ''
        })
        setKtpFile(null)
        // Update local state (simplified, ideally re-fetch or use result)
        // Since result.data is complex, we might just rely on revalidatePath and router.refresh()
        // But for now let's just reload the page to be safe or assume server action revalidates
        window.location.reload() 
      } else {
        toast.error(result.error || 'Gagal menambahkan penghuni')
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan')
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Daftar Penghuni 🏠
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Kelola data penghuni dan status sewa dengan mudah ✨</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
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
                <div className="space-y-1">
                  <Label htmlFor="ktp-upload" className="text-xs text-slate-500">Foto KTP (Opsional)</Label>
                  <Input 
                    id="ktp-upload"
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                </div>
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

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl shadow-indigo-100/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input 
              placeholder="Cari nama atau nomor kamar..." 
              className="pl-10 border-slate-200 focus-visible:ring-indigo-500 rounded-full bg-slate-50/50 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50/50">
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
            <AnimatePresence>
            {filteredTenants.map((tenant, index) => (
              <motion.tr 
                key={tenant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-indigo-50/30 transition-colors border-b border-slate-100 last:border-0"
              >
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tenant.namaLengkap}`} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {tenant.namaLengkap.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{tenant.namaLengkap}</p>
                      <p className="text-xs text-slate-500">{tenant.user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                    #{tenant.kamar.nomorKamar}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{tenant.noTelepon}</TableCell>
                <TableCell className="text-slate-600">{new Date(tenant.tanggalCheckIn).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</TableCell>
                <TableCell>
                  <StatusBadge status={tenant.statusSewa} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-indigo-50 hover:text-indigo-600">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-100">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem className="rounded-lg cursor-pointer">
                        <FileText className="w-4 h-4 mr-2" /> Detail Kontrak
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 focus:text-red-600 rounded-lg cursor-pointer focus:bg-red-50"
                        onClick={() => handleArchive(tenant.id)}
                      >
                        <UserX className="w-4 h-4 mr-2" /> Non-aktifkan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
            </AnimatePresence>
            {filteredTenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <p>Tidak ada data penghuni ditemukan</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}