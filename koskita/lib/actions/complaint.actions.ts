'use server'

import { db } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'
import { StatusPengaduan } from '@prisma/client'

export async function getComplaints() {
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

    const complaints = await db.pengaduan.findMany({
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
    return { success: true, data: complaints }
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return { success: false, error: 'Gagal mengambil data pengaduan' }
  }
}

export async function getTenantComplaints(penghuniId: string) {
  try {
    const complaints = await db.pengaduan.findMany({
      where: { penghuniId },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: complaints }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil riwayat pengaduan' }
  }
}

export async function createComplaint(data: {
  penghuniId: string
  judul: string
  deskripsi: string
  fotoURL?: string
}) {
  try {
    const complaint = await db.pengaduan.create({
      data: {
        penghuniId: data.penghuniId,
        judul: data.judul,
        deskripsi: data.deskripsi,
        fotoURL: data.fotoURL,
        status: 'BARU'
      }
    })
    
    revalidatePath('/dashboard/pengaduan')
    revalidatePath('/pengaduan')
    return { success: true, data: complaint }
  } catch (error) {
    console.error('Error creating complaint:', error)
    return { success: false, error: 'Gagal mengirim pengaduan' }
  }
}

export async function updateComplaintStatus(id: string, status: StatusPengaduan) {
  try {
    const complaint = await db.pengaduan.update({
      where: { id },
      data: { status }
    })
    
    revalidatePath('/dashboard/pengaduan')
    return { success: true, data: complaint }
  } catch (error) {
    console.error('Error updating complaint:', error)
    return { success: false, error: 'Gagal mengupdate status pengaduan' }
  }
}
