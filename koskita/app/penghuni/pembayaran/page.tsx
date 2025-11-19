import { getTenantPayments } from '@/lib/actions/payment.actions'
import { getTenantDashboardData } from '@/lib/actions/tenant.actions'
import { PembayaranClient } from '@/components/penghuni/pembayaran-client'

export default async function PenghuniPembayaranPage() {
  const [paymentsResult, tenantResult] = await Promise.all([
    getTenantPayments(),
    getTenantDashboardData()
  ])
  
  if (!paymentsResult.success || !tenantResult.success || !tenantResult.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Gagal memuat data</h2>
          <p className="text-slate-500 mt-2">Terjadi kesalahan saat mengambil data pembayaran</p>
        </div>
      </div>
    )
  }

  const hargaSewa = tenantResult.data.kamar?.harga || 0

  return (
    <PembayaranClient 
      initialPayments={paymentsResult.data || []} 
      hargaSewa={hargaSewa}
    />
  )
}
