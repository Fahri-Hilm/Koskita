'use server'

import { db } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return { success: false, error: 'Unauthorized' }
    }

    const owner = await db.owner.findUnique({
      where: { userId: session.user.id }
    })

    if (!owner) {
      return { success: false, error: 'Owner profile not found' }
    }

    const notifications = await db.notifikasi.findMany({
      where: { ownerId: owner.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const unreadCount = await db.notifikasi.count({
      where: { 
        ownerId: owner.id,
        isRead: false
      }
    })

    return { success: true, data: notifications, unreadCount }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return { success: false, error: 'Gagal mengambil notifikasi' }
  }
}

export async function markAsRead(id: string) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return { success: false, error: 'Unauthorized' }
    }

    await db.notifikasi.update({
      where: { id },
      data: { isRead: true }
    })

    revalidatePath('/owner')
    return { success: true }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: 'Gagal update status notifikasi' }
  }
}

export async function markAllAsRead() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== 'OWNER') {
      return { success: false, error: 'Unauthorized' }
    }

    const owner = await db.owner.findUnique({
      where: { userId: session.user.id }
    })

    if (!owner) {
      return { success: false, error: 'Owner profile not found' }
    }

    await db.notifikasi.updateMany({
      where: { 
        ownerId: owner.id,
        isRead: false
      },
      data: { isRead: true }
    })

    revalidatePath('/owner')
    return { success: true }
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return { success: false, error: 'Gagal update status notifikasi' }
  }
}
