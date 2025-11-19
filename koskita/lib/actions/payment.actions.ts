'use server'

import { db } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { StatusPembayaran } from '@prisma/client'

export async function getPayments() {
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

    const payments = await db.pembayaran.findMany({
      where: {
        penghuni: {
          ownerId: owner.id
        }
      },
      include: {
        penghuni: {
          select: {
            namaLengkap: true,
            kamar: {
              select: { nomorKamar: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: payments }
  } catch (error) {
    console.error('Error fetching payments:', error)
    return { success: false, error: 'Gagal mengambil data pembayaran' }
  }
}

export async function getTenantPayments(penghuniId: string) {
  try {
    const payments = await db.pembayaran.findMany({
      where: { penghuniId },
      orderBy: { bulan: 'desc' }
    })
    return { success: true, data: payments }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil riwayat pembayaran' }
  }
}

export async function createPayment(data: {
  penghuniId: string
  bulan: Date
  jumlah: number
  buktiURL: string
}) {
  try {
    // Ensure bulan is set to first day of month to avoid duplicates
    const bulanDate = new Date(data.bulan.getFullYear(), data.bulan.getMonth(), 1)

    const payment = await db.pembayaran.create({
      data: {
        penghuniId: data.penghuniId,
        bulan: bulanDate,
        jumlah: data.jumlah,
        buktiURL: data.buktiURL,
        status: 'PENDING',
        tglUpload: new Date()
      }
    })
    
    revalidatePath('/dashboard/pembayaran')
    revalidatePath('/pembayaran')
    return { success: true, data: payment }
  } catch (error) {
    console.error('Error creating payment:', error)
    return { success: false, error: 'Gagal upload bukti pembayaran' }
  }
}

export async function verifyPayment(id: string, status: StatusPembayaran) {
  try {
    const payment = await db.pembayaran.update({
      where: { id },
      data: {
        status,
        tglVerifikasi: status === 'DIVERIFIKASI' ? new Date() : null
      }
    })
    
    revalidatePath('/dashboard/pembayaran')
    return { success: true, data: payment }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return { success: false, error: 'Gagal memverifikasi pembayaran' }
  }
}
