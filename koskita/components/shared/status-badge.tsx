import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE' | 'PENDING' | 'DIVERIFIKASI' | 'JATUH_TEMPO' | 'LUNAS' | 'BARU' | 'DIPROSES' | 'SELESAI' | 'AKTIF' | 'NON_AKTIF'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    // Kamar Status
    KOSONG: 'bg-green-100 text-green-700 border-green-200',
    TERISI: 'bg-red-100 text-red-700 border-red-200',
    AKAN_KOSONG: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    MAINTENANCE: 'bg-gray-100 text-gray-700 border-gray-200',
    
    // Pembayaran Status
    PENDING: 'bg-orange-100 text-orange-700 border-orange-200',
    DIVERIFIKASI: 'bg-blue-100 text-blue-700 border-blue-200',
    JATUH_TEMPO: 'bg-red-100 text-red-700 border-red-200',
    LUNAS: 'bg-green-100 text-green-700 border-green-200',

    // Pengaduan Status
    BARU: 'bg-blue-100 text-blue-700 border-blue-200',
    DIPROSES: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    SELESAI: 'bg-green-100 text-green-700 border-green-200',

    // Sewa Status
    AKTIF: 'bg-green-100 text-green-700 border-green-200',
    NON_AKTIF: 'bg-gray-100 text-gray-700 border-gray-200',
  }

  const labels: Record<string, string> = {
    KOSONG: 'Kosong',
    TERISI: 'Terisi',
    AKAN_KOSONG: 'Akan Kosong',
    MAINTENANCE: 'Perawatan',
    PENDING: 'Menunggu',
    DIVERIFIKASI: 'Diverifikasi',
    JATUH_TEMPO: 'Jatuh Tempo',
    LUNAS: 'Lunas',
    BARU: 'Baru',
    DIPROSES: 'Diproses',
    SELESAI: 'Selesai',
    AKTIF: 'Aktif',
    NON_AKTIF: 'Non Aktif',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[status] || 'bg-gray-100 text-gray-700',
        className
      )}
    >
      {labels[status] || status}
    </span>
  )
}