import { getTenantDashboardData } from '@/lib/actions/tenant.actions'
import { DashboardClient } from '@/components/penghuni/dashboard-client'

export default async function PenghuniDashboard() {
  // Hardcoded tenant ID for Sprint 11
  const penghuniId = 'cm7d9x0un0000356999999999'
  
  const result = await getTenantDashboardData(penghuniId)
  
  if (!result.success || !result.data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900">Gagal memuat data</h2>
          <p className="text-slate-500 mt-2">{result.error || 'Terjadi kesalahan sistem'}</p>
        </div>
      </div>
    )
  }

  return <DashboardClient tenant={result.data} />
}
