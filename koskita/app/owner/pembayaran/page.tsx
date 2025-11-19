import { getPayments } from '@/lib/actions/payment.actions'
import { PembayaranClient } from '@/components/owner/pembayaran-client'

export default async function PembayaranPage() {
  // Hardcoded owner ID for Sprint 10
  const ownerId = 'cm7d9x0un0000356888888888'
  const result = await getPayments(ownerId)
  
  if (!result.success) {
    return <div>Error loading payments</div>
  }

  return <PembayaranClient initialPayments={result.data || []} />
}
