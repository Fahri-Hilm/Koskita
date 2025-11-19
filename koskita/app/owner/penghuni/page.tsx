import { getTenants } from '@/lib/actions/tenant.actions'
import { getRooms } from '@/lib/actions/room.actions'
import { PenghuniClient } from '@/components/owner/penghuni-client'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'

export default async function PenghuniPage() {
  const session = await auth()
  const owner = await db.owner.findUnique({
    where: { userId: session?.user?.id }
  })

  const [tenantsResult, roomsResult] = await Promise.all([
    getTenants(),
    getRooms()
  ])
  
  if (!tenantsResult.success || !roomsResult.success) {
    return <div>Error loading data</div>
  }

  return (
    <PenghuniClient 
      initialTenants={tenantsResult.data || []} 
      availableRooms={roomsResult.data || []}
      ownerId={owner?.id || ''}
    />
  )
}
