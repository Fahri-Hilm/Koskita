import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE' | 'PENDING' | 'DIVERIFIKASI' | 'JATUH_TEMPO' | 'LUNAS' | 'DITOLAK' | 'BARU' | 'DIPROSES' | 'SELESAI' | 'AKTIF' | 'NON_AKTIF'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants: Record<string, string> = {
    // Kamar Status
    KOSONG: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    TERISI: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    AKAN_KOSONG: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    MAINTENANCE: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    
    // Pembayaran Status
    PENDING: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
    DIVERIFIKASI: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    JATUH_TEMPO: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    LUNAS: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    DITOLAK: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',

    // Pengaduan Status
    BARU: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    DIPROSES: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    SELESAI: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',

    // Sewa Status
    AKTIF: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    NON_AKTIF: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
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