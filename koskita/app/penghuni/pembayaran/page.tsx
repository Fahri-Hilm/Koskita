import { getTenantPayments } from '@/lib/actions/payment.actions'
import { PembayaranClient } from '@/components/penghuni/pembayaran-client'

export default async function PenghuniPembayaranPage() {
  // Hardcoded tenant ID for Sprint 11
  const penghuniId = 'cm7d9x0un0000356999999999'
  const hargaSewa = 1500000 // Hardcoded for now, ideally fetch from tenant -> room -> price

  const result = await getTenantPayments(penghuniId)
  
  if (!result.success) {
    return <div>Error loading payments</div>
  }

  return (
    <PembayaranClient 
      initialPayments={result.data || []} 
      penghuniId={penghuniId}
      hargaSewa={hargaSewa}
    />
  )
}
