'use server'

import { db } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { KamarInput, kamarSchema } from '@/lib/validations'
import { StatusKamar } from '@prisma/client'

export async function getRooms() {
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

    const rooms = await db.kamar.findMany({
      where: { ownerId: owner.id },
      orderBy: { nomorKamar: 'asc' },
      include: {
        penghuni: {
          select: {
            namaLengkap: true
          }
        }
      }
    })
    return { success: true, data: rooms }
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return { success: false, error: 'Gagal mengambil data kamar' }
  }
}

export async function createRoom(data: KamarInput, ownerId: string) {
  try {
    const validated = kamarSchema.parse(data)
    
    const room = await db.kamar.create({
      data: {
        ...validated,
        ownerId,
        status: 'KOSONG'
      }
    })
    
    revalidatePath('/dashboard/kamar')
    return { success: true, data: room }
  } catch (error) {
    console.error('Error creating room:', error)
    return { success: false, error: 'Gagal membuat kamar' }
  }
}

export async function updateRoom(id: string, data: Partial<KamarInput>) {
  try {
    const room = await db.kamar.update({
      where: { id },
      data
    })
    
    revalidatePath('/dashboard/kamar')
    return { success: true, data: room }
  } catch (error) {
    console.error('Error updating room:', error)
    return { success: false, error: 'Gagal mengupdate kamar' }
  }
}

export async function deleteRoom(id: string) {
  try {
    await db.kamar.delete({
      where: { id }
    })
    
    revalidatePath('/dashboard/kamar')
    return { success: true }
  } catch (error) {
    console.error('Error deleting room:', error)
    return { success: false, error: 'Gagal menghapus kamar' }
  }
}

export async function getRoomStats(ownerId: string) {
  try {
    const total = await db.kamar.count({ where: { ownerId } })
    const terisi = await db.kamar.count({ where: { ownerId, status: 'TERISI' } })
    const kosong = await db.kamar.count({ where: { ownerId, status: 'KOSONG' } })
    const perbaikan = await db.kamar.count({ where: { ownerId, status: 'MAINTENANCE' } })
    
    return {
      success: true,
      data: { total, terisi, kosong, perbaikan }
    }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil statistik' }
  }
}
