import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/status-badge'
import { Users, Wifi, Wind } from 'lucide-react'

interface RoomCardProps {
  nomorKamar: string
  tipe: string
  harga: number
  status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE'
  penghuniName?: string
  onDetail?: () => void
}

export function RoomCard({ nomorKamar, tipe, harga, status, penghuniName, onDetail }: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200">
      <CardHeader className="p-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative flex items-center justify-center">
        <h3 className="text-4xl font-bold text-white/90">#{nomorKamar}</h3>
        <div className="absolute top-4 right-4">
          <StatusBadge status={status} className="bg-white/90 backdrop-blur-sm border-none" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Tipe Kamar</p>
            <p className="font-semibold text-slate-900">{tipe}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Harga/Bulan</p>
            <p className="font-semibold text-indigo-600">
              Rp {harga.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {penghuniName && (
          <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              {penghuniName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Penghuni</p>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
                {penghuniName}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs font-normal">
            <Wifi className="w-3 h-3 mr-1" /> WiFi
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal">
            <Wind className="w-3 h-3 mr-1" /> AC
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onDetail} 
          variant="outline" 
          className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
        >
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  )
}