import { getOwnerDashboardStats } from '@/lib/actions/dashboard.actions'
import { DashboardClient } from '@/components/owner/dashboard-client'

export default async function OwnerDashboardPage() {
  const result = await getOwnerDashboardStats()
  
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

  return <DashboardClient stats={result.data} />
}
