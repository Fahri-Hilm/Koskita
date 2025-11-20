import { getTenantDashboardData } from '@/lib/actions/tenant.actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { User, Phone, Home, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default async function PenghuniAkunPage() {
  const result = await getTenantDashboardData()
  
  if (!result.success || !result.data) {
    return <div>Error loading profile</div>
  }

  const tenant = result.data

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={tenant.fotoKTP || ''} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xl">
                {tenant.namaLengkap.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{tenant.namaLengkap}</CardTitle>
              <Badge variant="secondary" className="mt-2">
                Penghuni Aktif
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Nomor Telepon
              </label>
              <p className="text-slate-900">{tenant.noTelepon}</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Home className="w-4 h-4" /> Kamar Saat Ini
              </label>
              <p className="text-slate-900">
                Kamar {tenant.kamar?.nomorKamar || '-'}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Tanggal Masuk
              </label>
              <p className="text-slate-900">
                {format(new Date(tenant.tanggalCheckIn), 'd MMMM yyyy', { locale: id })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
