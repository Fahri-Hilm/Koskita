# KOSKITA - API Reference & Database Queries

## 📡 API Endpoints Overview

### Authentication Endpoints

```
POST   /api/auth/signin              # Login (handled by NextAuth)
POST   /api/auth/signout             # Logout
GET    /api/auth/session             # Get current session
```

---

## 👤 Owner API Endpoints

### Penghuni Management
```
GET    /api/owner/penghuni                    # Get all tenants
GET    /api/owner/penghuni/:id                # Get tenant details
POST   /api/owner/penghuni                    # Create new tenant
PATCH  /api/owner/penghuni/:id                # Update tenant
DELETE /api/owner/penghuni/:id                # (Soft) Delete tenant
POST   /api/owner/penghuni/:id/upload-ktp    # Upload KTP
```

**Respon Format:**
```json
{
  "id": "cuid-123",
  "namaLengkap": "Budi Santoso",
  "noIdentitas": "1234567890123456",
  "fotoKTP": "https://cloudinary.com/...",
  "noTelepon": "081234567890",
  "alamatAsal": "Jl. Raya No. 1",
  "tanggalCheckIn": "2025-01-01T00:00:00Z",
  "tanggalCheckOut": null,
  "statusSewa": "AKTIF",
  "kamar": {
    "id": "kamar-1",
    "nomorKamar": "101",
    "hargaSewa": 1500000,
    "status": "TERISI"
  },
  "user": {
    "email": "budi@email.com"
  }
}
```

### Kamar Management
```
GET    /api/owner/kamar                       # Get all rooms
GET    /api/owner/kamar/:id                   # Get room details
POST   /api/owner/kamar                       # Create new room
PATCH  /api/owner/kamar/:id                   # Update room (tipe, tarif, fasilitas)
```

**Create/Update Kamar Payload:**
```json
{
  "nomorKamar": "101",
  "tipe": "AC",
  "hargaSewa": 1500000,
  "fasilitas": ["Kasur", "Lemari", "Meja", "AC", "Kamar Mandi Dalam"],
  "status": "KOSONG"
}
```

**Get Kamar Respon:**
```json
{
  "id": "kamar-1",
  "nomorKamar": "101",
  "tipe": "AC",
  "hargaSewa": 1500000,
  "fasilitas": ["Kasur", "Lemari", "Meja", "AC"],
  "status": "TERISI",
  "penghuni": {
    "id": "penghuni-1",
    "namaLengkap": "Budi Santoso"
  }
}
```

### Pembayaran Management
```
GET    /api/owner/pembayaran                  # Get all payments (with filter)
GET    /api/owner/pembayaran/:id              # Get payment detail
PATCH  /api/owner/pembayaran/:id              # Verify payment
POST   /api/owner/pembayaran/manual           # Create manual payment record
```

**Query Parameters untuk GET pembayaran:**
```
?penghuniId=xxx&status=PENDING&bulan=2025-01
?sort=tanggalUpload&order=desc
```

**Verify Payment Payload:**
```json
{
  "status": "DIVERIFIKASI",
  "tglVerifikasi": "2025-01-15T10:00:00Z"
}
```

### Laporan
```
GET    /api/owner/laporan/keuangan            # Get financial report
GET    /api/owner/laporan/piutang             # Get debt summary
GET    /api/owner/laporan/export?format=pdf   # Export report
```

**Laporan Keuangan Respon:**
```json
{
  "periode": "2025-01",
  "totalPemasukan": 4500000,
  "totalPengaduan": 5,
  "totalPenghuni": 3,
  "riwayat": [
    {
      "tanggal": "2025-01-05",
      "penghuni": "Budi Santoso",
      "jumlah": 1500000,
      "status": "DIVERIFIKASI"
    }
  ]
}
```

### Pengaduan
```
GET    /api/owner/pengaduan                   # Get all complaints
GET    /api/owner/pengaduan/:id               # Get complaint detail
PATCH  /api/owner/pengaduan/:id               # Update complaint status
```

**Update Pengaduan Payload:**
```json
{
  "status": "DIPROSES",
  "catatan": "Sudah mengirim teknisi" // optional
}
```

### Notifikasi (Broadcast)
```
POST   /api/owner/notifikasi/broadcast        # Send broadcast message
GET    /api/owner/notifikasi/log              # Get notification log
```

**Broadcast Payload:**
```json
{
  "judul": "Pemberitahuan Penting",
  "konten": "Ada perbaikan air minggu depan",
  "tipe": "PENGUMUMAN"
}
```

### Check-out Management
```
GET    /api/owner/checkout-request            # Get all checkout requests
GET    /api/owner/checkout-request/:id        # Get checkout detail
PATCH  /api/owner/checkout-request/:id/finalize # Finalize checkout
```

**Finalize Checkout Payload:**
```json
{
  "denda": 0,
  "kerusakan": 500000
}
```

---

## 🏠 Penghuni API Endpoints

### Dashboard & Info
```
GET    /api/penghuni/dashboard                # Get tenant dashboard info
GET    /api/penghuni/info-sewa                # Get rental information
```

**Dashboard Respon:**
```json
{
  "kamar": {
    "nomorKamar": "101",
    "tipe": "AC",
    "hargaSewa": 1500000
  },
  "sewa": {
    "tanggalCheckIn": "2025-01-01T00:00:00Z",
    "sisaHari": 45,
    "jatuhTempo": "2025-02-01T00:00:00Z"
  },
  "pembayaran": {
    "bulanIni": {
      "status": "PENDING",
      "dueDate": "2025-01-01"
    }
  }
}
```

### Pembayaran
```
GET    /api/penghuni/pembayaran               # Get payment history
POST   /api/penghuni/pembayaran/upload        # Upload payment proof
```

**Upload Bukti Payload (multipart/form-data):**
```
file: <image file>
bulan: "2025-01"
```

**Pembayaran History Respon:**
```json
[
  {
    "id": "payment-1",
    "bulan": "2025-01",
    "jumlah": 1500000,
    "status": "DIVERIFIKASI",
    "tglUpload": "2025-01-05T10:00:00Z",
    "tglVerifikasi": "2025-01-06T14:00:00Z"
  }
]
```

### Pengaduan
```
GET    /api/penghuni/pengaduan                # Get my complaints
POST   /api/penghuni/pengaduan                # Create complaint
```

**Create Pengaduan Payload:**
```json
{
  "judul": "Kamar mandi rusak",
  "deskripsi": "Keran air tidak bisa ditutup",
  "foto": "file object (optional)"
}
```

**Pengaduan Respon:**
```json
[
  {
    "id": "pengaduan-1",
    "judul": "Kamar mandi rusak",
    "deskripsi": "Keran air tidak bisa ditutup",
    "status": "DIPROSES",
    "fotoURL": "https://cloudinary.com/...",
    "createdAt": "2025-01-10T08:00:00Z",
    "updatedAt": "2025-01-10T09:00:00Z"
  }
]
```

### Notifikasi
```
GET    /api/penghuni/notifikasi               # Get notifications
PATCH  /api/penghuni/notifikasi/:id/read     # Mark as read
```

### Akun & Profil
```
GET    /api/penghuni/akun                     # Get profile
PATCH  /api/penghuni/akun                     # Update profile
POST   /api/penghuni/akun/ganti-password      # Change password
```

**Update Profil Payload:**
```json
{
  "namaLengkap": "Budi Santoso",
  "noTelepon": "081234567890",
  "alamatAsal": "Jl. Raya No. 1"
}
```

**Ganti Password Payload:**
```json
{
  "passwordLama": "old_password",
  "passwordBaru": "new_password",
  "konfirmasiPassword": "new_password"
}
```

### Dokumen & Kontrak
```
GET    /api/penghuni/kontrak                  # Download contract
GET    /api/penghuni/peraturan                # Get rules document
```

### Check-out
```
POST   /api/penghuni/checkout-request        # Submit checkout request
GET    /api/penghuni/checkout-request        # Get my checkout status
```

**Submit Check-out Payload:**
```json
{
  "tanggalCheckOut": "2025-03-01T00:00:00Z",
  "alasan": "Pindah ke tempat lain"
}
```

---

## 📤 Upload Endpoints

```
POST   /api/upload/ktp                       # Upload KTP image
POST   /api/upload/bukti-transfer            # Upload payment proof
POST   /api/upload/pengaduan                 # Upload complaint photo
```

**Upload Respon:**
```json
{
  "success": true,
  "url": "https://cloudinary.com/...",
  "publicId": "koskita/ktp/penghuni_xxx"
}
```

---

## 🗄️ Common Database Queries (Prisma)

### Penghuni Queries

```typescript
// Get penghuni aktif
const activeTenants = await db.penghuni.findMany({
  where: {
    ownerId: ownerId,
    statusSewa: 'AKTIF',
    archivedAt: null,
  },
  include: {
    kamar: true,
    pembayaran: { where: { bulan: thisMonth } },
  },
})

// Get penghuni dengan pembayaran pending
const pendingPayments = await db.penghuni.findMany({
  where: {
    ownerId: ownerId,
    pembayaran: {
      some: {
        status: { in: ['PENDING', 'JATUH_TEMPO'] },
      },
    },
  },
  include: {
    pembayaran: {
      where: { status: { in: ['PENDING', 'JATUH_TEMPO'] } },
    },
  },
})

// Search penghuni by name or ID
const search = await db.penghuni.findMany({
  where: {
    OR: [
      { namaLengkap: { contains: searchTerm, mode: 'insensitive' } },
      { noIdentitas: { contains: searchTerm } },
    ],
  },
})
```

### Kamar Queries

```typescript
// Get semua kamar dengan status
const rooms = await db.kamar.findMany({
  where: { ownerId: ownerId },
  include: {
    penghuni: { select: { namaLengkap: true } },
  },
  orderBy: { nomorKamar: 'asc' },
})

// Get kamar kosong
const availableRooms = await db.kamar.findMany({
  where: {
    ownerId: ownerId,
    status: 'KOSONG',
  },
})

// Get kamar akan kosong (jatuh tempo < 7 hari)
const aboutToBeEmpty = await db.kamar.findMany({
  where: {
    ownerId: ownerId,
    status: 'TERISI',
    penghuni: {
      is: {
        tanggalCheckOut: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
  },
})
```

### Pembayaran Queries

```typescript
// Get pembayaran bulan ini
const thisMonthPayments = await db.pembayaran.findMany({
  where: {
    ownerId: ownerId,
    bulan: {
      gte: new Date('2025-01-01'),
      lt: new Date('2025-02-01'),
    },
  },
  include: { penghuni: true },
})

// Get payment stats
const stats = await db.pembayaran.groupBy({
  by: ['status'],
  where: { ownerId: ownerId },
  _count: true,
  _sum: { jumlah: true },
})
// Result: [
//   { status: 'DIVERIFIKASI', _count: 3, _sum: { jumlah: 4500000 } },
//   { status: 'PENDING', _count: 2, _sum: { jumlah: 3000000 } },
// ]

// Get revenue report
const revenueReport = await db.pembayaran.aggregate({
  where: {
    ownerId: ownerId,
    status: 'DIVERIFIKASI',
    tglVerifikasi: {
      gte: new Date('2025-01-01'),
      lt: new Date('2025-02-01'),
    },
  },
  _sum: { jumlah: true },
  _count: true,
})
```

### Pengaduan Queries

```typescript
// Get pengaduan by status
const newComplaints = await db.pengaduan.findMany({
  where: {
    penghuni: { ownerId },
    status: 'BARU',
  },
  include: { penghuni: { select: { namaLengkap: true } } },
  orderBy: { createdAt: 'desc' },
})

// Get complaint stats
const complaintStats = await db.pengaduan.groupBy({
  by: ['status'],
  where: { penghuni: { ownerId } },
  _count: true,
})
```

### Check-out Queries

```typescript
// Get pending checkout requests
const pendingCheckouts = await db.checkoutRequest.findMany({
  where: {
    penghuni: { ownerId },
    isFinalized: false,
  },
  include: {
    penghuni: { select: { namaLengkap: true, kamarId: true } },
  },
})

// Finalize checkout (transaction)
await db.$transaction(async (tx) => {
  // 1. Get checkout request
  const checkout = await tx.checkoutRequest.findUnique({
    where: { id: checkoutId },
    include: { penghuni: true },
  })

  // 2. Check if all payments settled
  const pendingPayments = await tx.pembayaran.count({
    where: {
      penghuniId: checkout.penghuniId,
      status: { in: ['PENDING', 'JATUH_TEMPO'] },
    },
  })

  if (pendingPayments > 0) {
    throw new Error('Masih ada pembayaran pending')
  }

  // 3. Update kamar
  await tx.kamar.update({
    where: { id: checkout.penghuni.kamarId },
    data: { status: 'KOSONG' },
  })

  // 4. Archive penghuni
  await tx.penghuni.update({
    where: { id: checkout.penghuniId },
    data: {
      statusSewa: 'NON_AKTIF',
      archivedAt: new Date(),
    },
  })

  // 5. Deactivate user
  await tx.user.update({
    where: { id: checkout.penghuni.userId },
    data: { isActive: false },
  })

  // 6. Finalize checkout
  await tx.checkoutRequest.update({
    where: { id: checkoutId },
    data: {
      isFinalized: true,
      finalizedAt: new Date(),
    },
  })
})
```

### Notifikasi Queries

```typescript
// Create notification
await db.notifikasi.create({
  data: {
    ownerId,
    tipe: 'KONTRAK_BERAKHIR',
    judul: 'Kontrak Berakhir Minggu Depan',
    konten: `${penghuni.namaLengkap} di kamar ${kamar.nomorKamar} kontraknya berakhir.`,
  },
})

// Get unread notifications
const unread = await db.notifikasi.findMany({
  where: { ownerId, isRead: false },
  orderBy: { createdAt: 'desc' },
})

// Mark as read
await db.notifikasi.update({
  where: { id },
  data: { isRead: true },
})
```

---

## 🔄 Data Validation & Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message",
  "code": "INVALID_REQUEST",
  "details": {
    "field": "email",
    "message": "Email already registered"
  }
}
```

### HTTP Status Codes Used
```
200 - OK
201 - Created
204 - No Content
400 - Bad Request (validation error)
401 - Unauthorized (not logged in)
403 - Forbidden (role check failed)
404 - Not Found
409 - Conflict (e.g., email already exist)
500 - Internal Server Error
```

---

## 🧪 API Testing Examples

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","password":"password"}'
```

### Test Get Penghuni
```bash
curl -X GET http://localhost:3000/api/owner/penghuni \
  -H "Authorization: Bearer <session_token>"
```

### Test Create Kamar
```bash
curl -X POST http://localhost:3000/api/owner/kamar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session_token>" \
  -d '{
    "nomorKamar":"101",
    "tipe":"AC",
    "hargaSewa":1500000,
    "fasilitas":["Kasur","AC"]
  }'
```

### Test Upload KTP
```bash
curl -X POST http://localhost:3000/api/upload/ktp \
  -H "Authorization: Bearer <session_token>" \
  -F "file=@/path/to/ktp.jpg" \
  -F "penghuniId=penghuni-123"
```

---

Last Updated: November 19, 2025
