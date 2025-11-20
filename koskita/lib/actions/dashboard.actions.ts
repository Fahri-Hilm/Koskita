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

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1) // Start from the 1st of that month

    const [
      totalRooms,
      emptyRooms,
      activeTenants,
      monthlyRevenue,
      pendingComplaints,
      revenueHistory,
      roomStatusStats
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
      }),
      // Revenue History (Last 6 months)
      db.pembayaran.findMany({
        where: {
          penghuni: { ownerId },
          status: { in: ['LUNAS', 'DIVERIFIKASI'] },
          bulan: {
            gte: sixMonthsAgo
          }
        },
        select: {
          bulan: true,
          jumlah: true
        },
        orderBy: {
          bulan: 'asc'
        }
      }),
      // Room Status Distribution
      db.kamar.groupBy({
        by: ['status'],
        where: { ownerId },
        _count: {
          status: true
        }
      })
    ])

    // Process Revenue History
    const monthlyData = new Map<string, number>()
    
    // Initialize last 6 months with 0
    for (let i = 0; i < 6; i++) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = d.toLocaleString('id-ID', { month: 'short' })
      monthlyData.set(key, 0)
    }

    revenueHistory.forEach(payment => {
      const monthName = payment.bulan.toLocaleString('id-ID', { month: 'short' })
      // We only care if it matches our initialized months (though it should given the query)
      if (monthlyData.has(monthName)) {
        monthlyData.set(monthName, (monthlyData.get(monthName) || 0) + payment.jumlah)
      }
    })

    // Convert Map to Array and reverse to show oldest to newest
    const revenueChartData = Array.from(monthlyData.entries())
      .map(([name, total]) => ({ name, total }))
      .reverse()

    // Process Room Status
    const roomStatusData = roomStatusStats.map(stat => ({
      name: stat.status,
      value: stat._count.status
    }))

    return {
      success: true,
      data: {
        totalRooms,
        emptyRooms,
        activeTenants,
        revenue: monthlyRevenue._sum.jumlah || 0,
        pendingComplaints,
        revenueChartData,
        roomStatusData
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return { success: false, error: 'Gagal mengambil data dashboard' }
  }
}