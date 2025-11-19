import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PaymentProgressBarProps {
  currentMonth: number // 1-12
  paidMonths: number[] // Array of month numbers that are paid
  className?: string
}

export function PaymentProgressBar({ currentMonth, paidMonths, className }: PaymentProgressBarProps) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return (
    <div className={cn("w-full overflow-x-auto pb-4", className)}>
      <div className="flex items-center justify-between min-w-[600px] relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 rounded-full" />
        
        {/* Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentMonth - 1) / 11) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-0 h-1 bg-indigo-100 -z-10 rounded-full" 
        />

        {months.map((month, index) => {
          const monthNum = index + 1
          const isPaid = paidMonths.includes(monthNum)
          const isCurrent = monthNum === currentMonth
          const isPast = monthNum < currentMonth

          let statusColor = 'bg-slate-100 border-slate-200 text-slate-400' // Default/Future
          
          if (isPaid) {
            statusColor = 'bg-green-500 border-green-500 text-white shadow-green-200'
          } else if (isPast && !isPaid) {
            statusColor = 'bg-red-500 border-red-500 text-white shadow-red-200'
          } else if (isCurrent && !isPaid) {
            statusColor = 'bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-50'
          }

          return (
            <div key={month} className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 shadow-lg",
                  statusColor
                )}
              >
                {isPaid ? '✓' : isPast ? '✕' : monthNum}
              </motion.div>
              <span className={cn(
                "text-xs font-medium",
                isCurrent ? "text-indigo-600" : "text-slate-400"
              )}>
                {month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}