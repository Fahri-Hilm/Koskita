'use server'

import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { PenghuniInput, penghuniSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'

export async function getTenants(ownerId: string) {
  try {
    const tenants = await db.penghuni.findMany({
      where: { 
        ownerId,
        archivedAt: null
      },
      include: {
        kamar: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: tenants }
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return { success: false, error: 'Gagal mengambil data penghuni' }
  }
}

export async function createTenant(data: PenghuniInput, ownerId: string) {
  try {
    const validated = penghuniSchema.parse(data)
    
    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser) {
      return { success: false, error: 'Email sudah terdaftar' }
    }

    // Check if kamar is available
    const kamar = await db.kamar.findUnique({
      where: { id: validated.kamarId }
    })

    if (!kamar || kamar.status !== 'KOSONG') {
      return { success: false, error: 'Kamar tidak tersedia' }
    }

    // Hash default password (e.g., "123456")
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Transaction: Create User -> Create Penghuni -> Update Kamar
    const result = await db.$transaction(async (tx: any) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: validated.email,
          passwordHash: hashedPassword,
          role: 'PENGHUNI',
          isActive: true
        }
      })

      // 2. Create Penghuni
      const penghuni = await tx.penghuni.create({
        data: {
          userId: user.id,
          ownerId,
          kamarId: validated.kamarId,
          namaLengkap: validated.namaLengkap,
          noIdentitas: validated.noIdentitas,
          noTelepon: validated.noTelepon,
          alamatAsal: validated.alamatAsal,
          tanggalCheckIn: validated.tanggalCheckIn,
          fotoKTP: validated.fotoKTP || '',
          statusSewa: 'AKTIF'
        }
      })

      // 3. Update Kamar Status
      await tx.kamar.update({
        where: { id: validated.kamarId },
        data: { status: 'TERISI' }
      })

      return penghuni
    })
    
    revalidatePath('/dashboard/penghuni')
    revalidatePath('/dashboard/kamar')
    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating tenant:', error)
    return { success: false, error: 'Gagal mendaftarkan penghuni' }
  }
}

export async function getTenantById(id: string) {
  try {
    const tenant = await db.penghuni.findUnique({
      where: { id },
      include: {
        kamar: true,
        user: { select: { email: true } }
      }
    })
    return { success: true, data: tenant }
  } catch (error) {
    return { success: false, error: 'Gagal mengambil detail penghuni' }
  }
}

export async function archiveTenant(id: string) {
  try {
    const tenant = await db.penghuni.findUnique({ where: { id } })
    if (!tenant) return { success: false, error: 'Penghuni tidak ditemukan' }

    await db.$transaction(async (tx: any) => {
      // 1. Archive Penghuni
      await tx.penghuni.update({
        where: { id },
        data: { 
          archivedAt: new Date(),
          statusSewa: 'NON_AKTIF',
          tanggalCheckOut: new Date()
        }
      })

      // 2. Update Kamar to KOSONG
      await tx.kamar.update({
        where: { id: tenant.kamarId },
        data: { status: 'KOSONG' }
      })
      
      // 3. Deactivate User
      await tx.user.update({
        where: { id: tenant.userId },
        data: { isActive: false }
      })
    })

    revalidatePath('/dashboard/penghuni')
    revalidatePath('/dashboard/kamar')
    return { success: true }
  } catch (error) {
    console.error('Error archiving tenant:', error)
    return { success: false, error: 'Gagal mengarsipkan penghuni' }
  }
}
