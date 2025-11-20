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
  onEdit?: () => void
  onDelete?: () => void
}

export function RoomCard({ nomorKamar, tipe, harga, status, penghuniName, onDetail, onEdit, onDelete }: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200 dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="p-0 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-900 dark:to-purple-900 relative flex items-center justify-center">
        <h3 className="text-4xl font-bold text-white/90">#{nomorKamar}</h3>
        <div className="absolute top-4 right-4">
          <StatusBadge status={status} className="bg-white/90 backdrop-blur-sm border-none dark:bg-slate-900/90 dark:text-white" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground dark:text-slate-400">Tipe Kamar</p>
            <p className="font-semibold text-slate-900 dark:text-white">{tipe}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground dark:text-slate-400">Harga/Bulan</p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400">
              Rp {harga.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {penghuniName && (
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-xs">
              {penghuniName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-muted-foreground dark:text-slate-400">Penghuni</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">
                {penghuniName}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">
            <Wifi className="w-3 h-3 mr-1" /> WiFi
          </Badge>
          <Badge variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">
            <Wind className="w-3 h-3 mr-1" /> AC
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {onEdit ? (
          <>
            <Button onClick={onEdit} variant="outline" className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950">
              Edit
            </Button>
            <Button onClick={onDelete} variant="destructive" size="icon">
              <span className="sr-only">Hapus</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </Button>
          </>
        ) : (
          <Button 
            onClick={onDetail} 
            variant="outline" 
            className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
          >
            Lihat Detail
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}