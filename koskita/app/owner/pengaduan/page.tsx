import { getComplaints } from '@/lib/actions/complaint.actions'
import { PengaduanClient } from '@/components/owner/pengaduan-client'

export default async function PengaduanPage() {
  const result = await getComplaints()
  
  if (!result.success) {
    return <div>Error loading complaints</div>
  }

  return <PengaduanClient initialComplaints={result.data || []} />
}
