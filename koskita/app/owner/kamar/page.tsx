import { getRooms } from '@/lib/actions/room.actions'
import { KamarClient } from '@/components/owner/kamar-client'
import { auth } from '@/auth'
import { db } from '@/lib/prisma'

export default async function KamarPage() {
  const session = await auth()
  const owner = await db.owner.findUnique({
    where: { userId: session?.user?.id }
  })

  const result = await getRooms()
  
  if (!result.success) {
    return <div>Error loading rooms</div>
  }

  return <KamarClient initialRooms={result.data || []} ownerId={owner?.id || ''} />
}
