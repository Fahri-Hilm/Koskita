import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  // 1. Create Owner
  const ownerUser = await prisma.user.upsert({
    where: { email: 'owner@test.com' },
    update: {},
    create: {
      email: 'owner@test.com',
      passwordHash,
      role: 'OWNER',
      owner: {
        create: {
          namaKos: 'Kos Sejahtera',
          alamat: 'Jl. Mawar No. 10',
          noTelepon: '081234567890'
        }
      }
    },
    include: { owner: true }
  })

  console.log('Owner created:', ownerUser.email)

  // 2. Create Room
  if (ownerUser.owner) {
    const room = await prisma.kamar.upsert({
      where: {
        ownerId_nomorKamar: {
          ownerId: ownerUser.owner.id,
          nomorKamar: '101'
        }
      },
      update: {},
      create: {
        ownerId: ownerUser.owner.id,
        nomorKamar: '101',
        tipe: 'AC',
        hargaSewa: 1500000,
        status: 'TERISI',
        fasilitas: ['Kasur', 'Lemari', 'AC', 'WiFi']
      }
    })

    console.log('Room created:', room.nomorKamar)

    // 3. Create Tenant
    const tenantUser = await prisma.user.upsert({
      where: { email: 'tenant@test.com' },
      update: {},
      create: {
        email: 'tenant@test.com',
        passwordHash,
        role: 'PENGHUNI',
        penghuni: {
          create: {
            ownerId: ownerUser.owner.id,
            kamarId: room.id,
            namaLengkap: 'Budi Santoso',
            noTelepon: '089876543210',
            noIdentitas: '3201234567890001',
            fotoKTP: 'https://example.com/ktp.jpg',
            alamatAsal: 'Jl. Kampung Halaman No. 1',
            tanggalCheckIn: new Date(),
            statusSewa: 'AKTIF'
          }
        }
      }
    })
    console.log('Tenant created:', tenantUser.email)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
