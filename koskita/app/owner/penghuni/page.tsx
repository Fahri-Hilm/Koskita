import { getTenants } from '@/lib/actions/tenant.actions'
import { getRooms } from '@/lib/actions/room.actions'
import { PenghuniClient } from '@/components/owner/penghuni-client'

export default async function PenghuniPage() {
  // Hardcoded owner ID for Sprint 10
  const ownerId = 'cm7d9x0un0000356888888888'
  
  const [tenantsResult, roomsResult] = await Promise.all([
    getTenants(ownerId),
    getRooms(ownerId)
  ])
  
  if (!tenantsResult.success || !roomsResult.success) {
    return <div>Error loading data</div>
  }

  return (
    <PenghuniClient 
      initialTenants={tenantsResult.data || []} 
      availableRooms={roomsResult.data || []}
      ownerId={ownerId}
    />
  )
}
