'use server'

import { db } from '@/lib/prisma'
import { auth } from '@/auth'

export async function getOwnerDashboardStats() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return { success: false, error: 'Unauthorized' }
    }
    
    // Get Owner ID from User ID
    const owner = await db.owner.findUnique({
      where: { userId: session.user.id }
    })

    if (!owner) {
      return { success: false, error: 'Owner profile not found' }
    }

    const ownerId = owner.id

    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const [
      totalRooms,
      emptyRooms,
      activeTenants,
      monthlyRevenue,
      pendingComplaints
    ] = await Promise.all([
      // Total Rooms
      db.kamar.count({
        where: { ownerId }
      }),
      // Empty Rooms
      db.kamar.count({
        where: { 
          ownerId,
          status: 'KOSONG'
        }
      }),
      // Active Tenants
      db.penghuni.count({
        where: { 
          ownerId,
          archivedAt: null
        }
      }),
      // Monthly Revenue (Sum of payments in current month)
      db.pembayaran.aggregate({
        where: {
          penghuni: { ownerId },
          status: { in: ['LUNAS', 'DIVERIFIKASI'] },
          bulan: {
            gte: firstDayOfMonth,
            lt: nextMonth
          }
        },
        _sum: {
          jumlah: true
        }
      }),
      // Pending Complaints
      db.pengaduan.count({
        where: {
          penghuni: { ownerId },
          status: 'BARU'
        }
      })
    ])

    return {
      success: true,
      data: {
        totalRooms,
        emptyRooms,
        activeTenants,
        revenue: monthlyRevenue._sum.jumlah || 0,
        pendingComplaints
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { success: false, error: 'Gagal mengambil data dashboard' }
  }
}