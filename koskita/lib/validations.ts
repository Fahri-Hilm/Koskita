import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const penghuniSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  noIdentitas: z.string().regex(/^\d{16}$/, 'Nomor identitas tidak valid'),
  noTelepon: z.string().regex(/^08\d{9,11}$/, 'Nomor telepon tidak valid'),
  alamatAsal: z.string().min(5, 'Alamat minimal 5 karakter'),
  tanggalCheckIn: z.date(),
})

export const kamarSchema = z.object({
  nomorKamar: z.string().min(1, 'Nomor kamar wajib diisi'),
  tipe: z.enum(['AC', 'NON_AC', 'PREMIUM']),
  hargaSewa: z.number().min(100000, 'Harga minimal 100ribu'),
  fasilitas: z.array(z.string()).min(1, 'Minimal 1 fasilitas'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type PenghuniInput = z.infer<typeof penghuniSchema>
export type KamarInput = z.infer<typeof kamarSchema>