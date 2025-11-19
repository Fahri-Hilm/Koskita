import { getPayments } from '@/lib/actions/payment.actions'
import { PembayaranClient } from '@/components/owner/pembayaran-client'

export default async function PembayaranPage() {
  const result = await getPayments()
  
  if (!result.success) {
    return <div>Error loading payments</div>
  }

  return <PembayaranClient initialPayments={result.data || []} />
}
