import { getTenantComplaints } from '@/lib/actions/complaint.actions'
import { PengaduanClient } from '@/components/penghuni/pengaduan-client'

export default async function PenghuniPengaduanPage() {
  const result = await getTenantComplaints()
  
  if (!result.success) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Gagal memuat data</h2>
          <p className="text-slate-500 mt-2">Terjadi kesalahan saat mengambil data pengaduan</p>
        </div>
      </div>
    )
  }

  return (
    <PengaduanClient 
      initialComplaints={result.data || []} 
    />
  )
}
