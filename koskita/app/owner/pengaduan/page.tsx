import { getComplaints } from '@/lib/actions/complaint.actions'
import { PengaduanClient } from '@/components/owner/pengaduan-client'

export default async function PengaduanPage() {
  // Hardcoded owner ID for Sprint 10
  const ownerId = 'cm7d9x0un0000356888888888'
  const result = await getComplaints(ownerId)
  
  if (!result.success) {
    return <div>Error loading complaints</div>
  }

  return <PengaduanClient initialComplaints={result.data || []} />
}
