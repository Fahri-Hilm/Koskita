'use client'

import { useState } from 'react'
import { PenghuniLayout } from '@/components/layout/penghuni-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { StatusBadge } from '@/components/shared/status-badge'
import { Upload, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PembayaranPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Bukti pembayaran berhasil diupload', {
      description: 'Admin akan segera memverifikasi pembayaran Anda.'
    })
    setUploading(false)
    setFile(null)
  }

  // Dummy history
  const history = [
    { id: 1, bulan: 'Oktober 2025', jumlah: 1500000, status: 'LUNAS', tgl: '25 Oct 2025' },
    { id: 2, bulan: 'September 2025', jumlah: 1500000, status: 'LUNAS', tgl: '24 Sep 2025' },
    { id: 3, bulan: 'Agustus 2025', jumlah: 1500000, status: 'LUNAS', tgl: '25 Aug 2025' },
  ]

  return (
    <PenghuniLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pembayaran</h1>
          <p className="text-slate-500">Upload bukti transfer dan cek riwayat</p>
        </div>

        {/* Upload Section */}
        <Card className="border-indigo-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-indigo-600">Upload Bukti Transfer</CardTitle>
            <CardDescription>
              Silakan transfer ke BCA 1234567890 a.n Koskita Owner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <Input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    {file ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {file ? file.name : 'Klik untuk upload gambar'}
                  </div>
                  <div className="text-xs text-slate-500">
                    JPG, PNG max 5MB
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!file || uploading}
              >
                {uploading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Riwayat Pembayaran</h2>
          <div className="space-y-3">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.bulan}</p>
                    <p className="text-xs text-slate-500">{item.tgl}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">Rp {item.jumlah.toLocaleString('id-ID')}</p>
                  <StatusBadge status={item.status as any} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PenghuniLayout>
  )
}