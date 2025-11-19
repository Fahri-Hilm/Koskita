import { getTenantComplaints } from '@/lib/actions/complaint.actions'
import { PengaduanClient } from '@/components/penghuni/pengaduan-client'

export default async function PenghuniPengaduanPage() {
  // Hardcoded tenant ID for Sprint 11
  const penghuniId = 'cm7d9x0un0000356999999999'
  
  const result = await getTenantComplaints(penghuniId)
  
  if (!result.success) {
    return <div>Error loading complaints</div>
  }

  return (
    <PengaduanClient 
      initialComplaints={result.data || []} 
      penghuniId={penghuniId}
    />
  )
}
