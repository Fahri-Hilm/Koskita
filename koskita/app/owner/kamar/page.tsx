import { getRooms } from '@/lib/actions/room.actions'
import { KamarClient } from '@/components/owner/kamar-client'

export default async function KamarPage() {
  // Hardcoded owner ID for Sprint 10
  const ownerId = 'cm7d9x0un0000356888888888'
  const result = await getRooms(ownerId)
  
  if (!result.success) {
    return <div>Error loading rooms</div>
  }

  return <KamarClient initialRooms={result.data || []} ownerId={ownerId} />
}
