# KOSKITA - Perencanaan Teknis & Roadmap Implementasi

## 📋 Ringkasan Eksekutif

**Project:** Website Manajemen Kos-Kosan (KOSKITA)  
**Paradigma:** Role-Based Access Control (Owner + Penghuni)  
**Tech Stack:** Next.js 14+ (TS), Shadcn/UI, Tailwind CSS, Framer Motion, Prisma ORM  
**Database:** PostgreSQL (atau MySQL)  
**Storage:** Cloudinary (untuk KTP, bukti transfer)  
**Deployment:** Vercel / Railway  

---

## 🎯 Fase Implementasi (12 Sprint)

### **FASE 1: FOUNDATION (Sprint 1-2)**

#### Sprint 1: Analisis & Setup Inisial
**Deliverable:**
- ✅ Clone starter kit next-shadcn-dashboard
- ✅ Setup project structure (app router, folder organization)
- ✅ Install dependencies: Shadcn/UI, Framer Motion, Prisma, Cloudinary SDK
- ✅ Setup .env variables
- ✅ Create Git repository & configure deployment preview

**Dependencies:**
```bash
npm install framer-motion
npm install next-auth@latest
npm install @prisma/client prisma
npm install next-cloudinary
npm install react-hook-form zod
npm install axios
```

**Project Structure:**
```
koskita/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (owner)/
│   │   ├── dashboard/
│   │   ├── penghuni/
│   │   ├── kamar/
│   │   ├── keuangan/
│   │   └── laporan/
│   ├── (penghuni)/
│   │   ├── dashboard/
│   │   ├── pembayaran/
│   │   ├── pengaduan/
│   │   └── akun/
│   ├── api/
│   │   ├── auth/
│   │   ├── penghuni/
│   │   ├── kamar/
│   │   ├── pembayaran/
│   │   └── upload/
│   └── layout.tsx
├── components/
│   ├── ui/ (Shadcn components)
│   ├── auth/
│   ├── owner/
│   ├── penghuni/
│   └── shared/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── cloudinary.ts
├── prisma/
│   └── schema.prisma
└── public/
```

---

#### Sprint 2: Database Design & Models
**Deliverable:**
- ✅ Design database schema (Prisma)
- ✅ Create migrations
- ✅ Setup Prisma client

**Database Schema:**

```prisma
// User (Owner + Penghuni Login)
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  role          Role      @default(PENGHUNI)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  owner     Owner?
  penghuni  Penghuni?

  @@index([email])
}

enum Role {
  OWNER
  PENGHUNI
}

// Owner Profile
model Owner {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  namaKos       String
  alamat        String
  noTelepon     String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  kamar         Kamar[]
  penghuni      Penghuni[]
  notifikasi    Notifikasi[]
}

// Kamar
model Kamar {
  id            String    @id @default(cuid())
  ownerId       String
  owner         Owner     @relation(fields: [ownerId], references: [id])
  nomorKamar    String
  tipe          String    // "AC", "Non-AC", "Premium"
  hargaSewa     Int       // per bulan
  status        StatusKamar @default(KOSONG)
  fasilitas     String[]  // ["Kasur", "Lemari", "Meja"]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  penghuni      Penghuni?
  riwayat       RiwayatKamar[]

  @@unique([ownerId, nomorKamar])
  @@index([ownerId, status])
}

enum StatusKamar {
  KOSONG
  TERISI
  AKAN_KOSONG
  MAINTENANCE
}

// Penghuni (Tenant)
model Penghuni {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  ownerId         String
  owner           Owner     @relation(fields: [ownerId], references: [id])
  kamarId         String    @unique
  kamar           Kamar     @relation(fields: [kamarId], references: [id])
  
  namaLengkap     String
  noIdentitas     String    @unique
  fotoKTP         String    // Cloudinary URL
  noTelepon       String
  alamatAsal      String
  
  tanggalCheckIn  DateTime
  tanggalCheckOut DateTime?
  statusSewa      StatusSewa @default(AKTIF
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  archivedAt      DateTime?

  pembayaran      Pembayaran[]
  pengaduan       Pengaduan[]
  checkoutRequest CheckoutRequest?

  @@index([ownerId, statusSewa])
  @@index([archivedAt])
}

enum StatusSewa {
  AKTIF
  NON_AKTIF
}

// Kontrak Sewa
model KontrakSewa {
  id            String    @id @default(cuid())
  penghuni      Penghuni  @relation(fields: [penghuniId], references: [id])
  penghuniId    String
  
  dokumenURL    String    // Cloudinary PDF
  tanggalMulai  DateTime
  tanggalBerakhir DateTime
  createdAt     DateTime  @default(now())
}

// Pembayaran
model Pembayaran {
  id            String    @id @default(cuid())
  penghuniId    String
  penghuni      Penghuni  @relation(fields: [penghuniId], references: [id])
  
  bulan         DateTime  // Jan 2025, etc
  jumlah        Int
  status        StatusPembayaran @default(PENDING
  buktiURL      String?   // Cloudinary image
  tglUpload     DateTime?
  tglVerifikasi DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([penghuniId, bulan])
  @@index([penghuniId, status])
}

enum StatusPembayaran {
  PENDING
  DIVERIFIKASI
  JATUH_TEMPO
  LUNAS
}

// Pengaduan / Complaint
model Pengaduan {
  id            String    @id @default(cuid())
  penghuniId    String
  penghuni      Penghuni  @relation(fields: [penghuniId], references: [id])
  
  judul         String
  deskripsi     String
  status        StatusPengaduan @default(BARU
  fotoURL       String?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([penghuniId, status])
}

enum StatusPengaduan {
  BARU
  DIPROSES
  SELESAI
}

// Check-out Request
model CheckoutRequest {
  id            String    @id @default(cuid())
  penghuniId    String    @unique
  penghuni      Penghuni  @relation(fields: [penghuniId], references: [id])
  
  tanggalAjuan  DateTime  @default(now())
  tanggalCheckOut DateTime
  alasan        String?
  
  statusPembayaran StatusPembayaran @default(PENDING
  denda         Int       @default(0)
  kerusakan     Int       @default(0)
  
  isFinalized   Boolean   @default(false)
  finalizedAt   DateTime?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// Notifikasi
model Notifikasi {
  id            String    @id @default(cuid())
  ownerId       String
  owner         Owner     @relation(fields: [ownerId], references: [id])
  
  tipe          TipeNotifikasi
  judul         String
  konten        String
  isRead        Boolean   @default(false)
  
  createdAt     DateTime  @default(now())
}

enum TipeNotifikasi {
  PENGADUAN_BARU
  KONTRAK_BERAKHIR
  PEMBAYARAN_JATUH_TEMPO
  CHECKOUT_REQUEST
}

// Riwayat Kamar (untuk tracking perubahan status)
model RiwayatKamar {
  id            String    @id @default(cuid())
  kamarId       String
  kamar         Kamar     @relation(fields: [kamarId], references: [id])
  
  statusLama    StatusKamar
  statusBaru    StatusKamar
  catatan       String?
  
  createdAt     DateTime  @default(now())
}
```

---

### **FASE 2: AUTHENTICATION & AUTH FLOW (Sprint 3)**

#### Sprint 3: Implementasi Login & Middleware

**Deliverable:**
- ✅ Setup NextAuth v5 dengan Credentials Provider
- ✅ Create login page dengan Gen Z aesthetic
- ✅ Middleware untuk protect routes
- ✅ Redirect logic berdasarkan role

**Key Files:**

```typescript
// lib/auth.ts
import { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from './prisma'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) return null
        if (!user.isActive) return null

        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const path = request.nextUrl.pathname

      // Protect owner routes
      if (path.startsWith('/owner') && !isLoggedIn)
        return false
      if (path.startsWith('/owner') && auth?.user?.role !== 'OWNER')
        return false

      // Protect penghuni routes
      if (path.startsWith('/penghuni') && !isLoggedIn)
        return false
      if (path.startsWith('/penghuni') && auth?.user?.role !== 'PENGHUNI')
        return false

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=InvalidCredentials',
  },
}
```

```typescript
// middleware.ts
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth?.user
  const pathname = req.nextUrl.pathname

  // Redirect ke login jika belum login
  if (!isLoggedIn && (pathname.startsWith('/owner') || pathname.startsWith('/penghuni'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect berdasarkan role
  if (pathname === '/' && isLoggedIn) {
    const role = req.auth?.user?.role
    return NextResponse.redirect(
      new URL(
        role === 'OWNER' ? '/owner/dashboard' : '/penghuni/dashboard',
        req.url
      )
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

**Login Page Style (Gen Z):**
- Float label animation untuk email & password
- Glassmorphism background (semi-transparent + blur)
- Smooth gradient background
- Loading state dengan spinner animation
- Error messages dengan subtle slide-in animation

---

### **FASE 3: UI DESIGN SYSTEM (Sprint 4-5)**

#### Sprint 4: Component Library & Theming

**Deliverable:**
- ✅ Setup Shadcn/UI dengan custom theme
- ✅ Create custom components (FloatLabel, StatusBadge, etc)
- ✅ Framer Motion animations setup
- ✅ Tailwind config untuk Gen Z palette

**Color Palette (Gen Z Minimalist):**
```css
Primary: #6366F1 (Indigo)
Secondary: #EC4899 (Pink)
Success: #10B981 (Emerald)
Warning: #F59E0B (Amber)
Danger: #EF4444 (Red)
Neutral: #64748B (Slate)
Background: #FFFFFF or #F8FAFC (Light)
```

**Custom Components:**
- `FloatLabelInput` - Input dengan animated label
- `StatusBadge` - Color-coded status badge (Kosong/Terisi/Akan Kosong)
- `RoomCard` - Card untuk display kamar
- `PaymentProgressBar` - Progress bar dengan sisa hari
- `AnimatedCard` - Card dengan entrance animation
- `ConfirmDialog` - Dialog dengan smooth animation

#### Sprint 5: Framer Motion Animations

**Key Animations:**
- Page transitions (fade + slide)
- Card entrance (stagger effect)
- Status change transitions
- Loading skeletons
- Notification toasts

---

### **FASE 4: DASHBOARD OWNER - BAGIAN 1 (Sprint 6-7)**

#### Sprint 6: Manajemen Penghuni & Kamar

**Deliverable:**
- ✅ Halaman list penghuni dengan filter/search
- ✅ Modal upload KTP (drag-drop, preview)
- ✅ Form add penghuni baru
- ✅ Halaman list kamar dengan status visual
- ✅ Form setting tipe & tarif kamar

**API Endpoints:**
```
GET    /api/owner/penghuni              # List penghuni
POST   /api/owner/penghuni              # Create penghuni
PATCH  /api/owner/penghuni/:id          # Update penghuni
GET    /api/owner/kamar                 # List kamar
POST   /api/owner/kamar                 # Create kamar
PATCH  /api/owner/kamar/:id             # Update kamar & tarif
POST   /api/owner/kamar/:id/upload-ktp  # Upload KTP
```

**KTP Upload Feature:**
- Integration dengan Cloudinary
- Image optimization (resize, compress)
- Secure token untuk akses KTP
- Validation (file size, format)
- Preview sebelum upload

#### Sprint 7: Dashboard Owner - Visualisasi & Dashboard

**Deliverable:**
- ✅ Owner dashboard main page
- ✅ Kamar grid/list dengan color-coded status
- ✅ Quick stats (Total Penghuni, Pembayaran Pending, dll)
- ✅ Upcoming contract end notifications
- ✅ Search & filter penghuni

---

### **FASE 5: DASHBOARD OWNER - BAGIAN 2 (Sprint 8-9)**

#### Sprint 8: Manajemen Keuangan

**Deliverable:**
- ✅ Pencatatan pembayaran manual
- ✅ Verifikasi bukti transfer
- ✅ Status pembayaran per penghuni (Lunas/Belum/Jatuh Tempo)
- ✅ Laporan keuangan bulanan/tahunan (export PDF/Excel)
- ✅ Dashboard analytics (income trend, piutang tracking)

**API Endpoints:**
```
GET    /api/owner/pembayaran            # List pembayaran
POST   /api/owner/pembayaran            # Create pembayaran
PATCH  /api/owner/pembayaran/:id        # Verify pembayaran
GET    /api/owner/laporan/keuangan      # Generate laporan
GET    /api/owner/laporan/piutang       # Get piutang summary
```

#### Sprint 9: Komunikasi & Pengaduan

**Deliverable:**
- ✅ Kotak masuk pengaduan dari penghuni
- ✅ Update status pengaduan (Baru/Diproses/Selesai)
- ✅ Fitur broadcast notifikasi ke semua penghuni
- ✅ Notification log/history

**API Endpoints:**
```
GET    /api/owner/pengaduan             # List pengaduan
PATCH  /api/owner/pengaduan/:id         # Update status
POST   /api/owner/notifikasi            # Send broadcast
GET    /api/owner/notifikasi/log        # Get notifikasi log
```

---

### **FASE 6: DASHBOARD PENGHUNI (Sprint 10-11)**

#### Sprint 10: Main Features (Info Sewa & Pembayaran)

**Deliverable:**
- ✅ Landing page/dashboard utama
  - Snapshot kondisi sewa (nomor kamar, tipe, harga, jatuh tempo)
  - Progress bar animasi (sisa hari)
  - Status sewa visual
- ✅ Payment center
  - Upload bukti transfer (drag-drop)
  - History pembayaran
  - Due date tracking dengan visual warning
- ✅ Pengaduan & perbaikan
  - Form submit pengaduan
  - Tracking status pengaduan

**API Endpoints:**
```
GET    /api/penghuni/dashboard          # Get sewa info
GET    /api/penghuni/pembayaran         # List pembayaran
POST   /api/penghuni/pembayaran/upload  # Upload bukti
GET    /api/penghuni/pengaduan          # List pengaduan
POST   /api/penghuni/pengaduan          # Submit pengaduan
GET    /api/penghuni/notifikasi         # Get notifikasi
```

#### Sprint 11: Admin Menu & Akun

**Deliverable:**
- ✅ Halaman aturan & dokumen (download kontrak)
- ✅ Notifikasi inbox
- ✅ Pengaturan akun (update data kontak)
- ✅ Ganti password
- ✅ Pengajuan check-out

**API Endpoints:**
```
GET    /api/penghuni/kontrak            # Download kontrak
PATCH  /api/penghuni/akun               # Update profil
POST   /api/penghuni/akun/ganti-password
POST   /api/penghuni/checkout-request   # Submit checkout
GET    /api/penghuni/checkout-request   # Get checkout status
```

---

### **FASE 7: FILE UPLOAD & STORAGE (Sprint 8 - Parallel)**

#### File Upload Strategy

**Cloudinary Integration:**
```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadKTP(file: File, penghuniId: string) {
  const buffer = await file.arrayBuffer()
  
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({
      folder: 'koskita/ktp',
      public_id: `penghuni_${penghuniId}`,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    }, (error, result) => {
      if (error) reject(error)
      resolve(result)
    })
    
    stream.end(buffer)
  })

  return result?.secure_url
}

export async function uploadBuktiTransfer(file: File, pembayaranId: string) {
  // Similar implementation
}
```

**Upload Endpoints:**
```
POST   /api/upload/ktp                  # Upload KTP
POST   /api/upload/bukti-transfer       # Upload bukti pembayaran
POST   /api/upload/kontrak              # Upload dokumen kontrak
POST   /api/upload/pengaduan            # Upload foto pengaduan
```

---

### **FASE 8: CHECKOUT AUTOMASI (Sprint 12 - Parallel)**

#### Checkout Flow Teknis

**Database Transaction:**
```typescript
// app/api/owner/checkout/finalize/route.ts
export async function POST(req: Request) {
  const { checkoutRequestId } = await req.json()

  try {
    await db.$transaction(async (tx) => {
      // 1. Get checkout request detail
      const checkout = await tx.checkoutRequest.findUnique({
        where: { id: checkoutRequestId },
        include: { penghuni: true },
      })

      if (!checkout) throw new Error('Checkout request not found')

      // 2. Verify all payments settled
      const pendingPayments = await tx.pembayaran.findMany({
        where: {
          penghuniId: checkout.penghuniId,
          status: { in: ['PENDING', 'JATUH_TEMPO'] },
        },
      })

      if (pendingPayments.length > 0) {
        throw new Error('Masih ada pembayaran yang belum terselesaikan')
      }

      // 3. Update kamar status to KOSONG
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

      // 5. Deactivate user account
      await tx.user.update({
        where: { id: checkout.penghuni.userId },
        data: { isActive: false },
      })

      // 6. Finalize checkout request
      await tx.checkoutRequest.update({
        where: { id: checkoutRequestId },
        data: {
          isFinalized: true,
          finalizedAt: new Date(),
        },
      })

      // 7. Create audit log
      await tx.riwayatKamar.create({
        data: {
          kamarId: checkout.penghuni.kamarId,
          statusLama: 'TERISI',
          statusBaru: 'KOSONG',
          catatan: `Penghuni ${checkout.penghuni.namaLengkap} check-out`,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
```

**Check-out Management Features:**
- List checkout requests dari penghuni
- Verifikasi status pembayaran akhir
- Calculate denda (jika ada)
- Finalize dengan satu click
- Auto-archive penghuni lama

---

## 🔧 Development Stack Details

### Frontend
- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **State Management:** React Context / Zustand
- **Icons:** Lucide React

### Backend
- **API:** Next.js API Routes / Route Handlers
- **ORM:** Prisma
- **Authentication:** NextAuth v5
- **File Upload:** Cloudinary
- **Validation:** Zod

### Database
- **Primary:** PostgreSQL (Vercel Postgres / Railway)
- **Alternative:** MySQL 8+

### Deployment
- **Frontend/API:** Vercel
- **Database:** Railway / Vercel Postgres
- **Storage:** Cloudinary
- **DNS:** Vercel Managed / Custom Domain

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   USER BROWSER                       │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────┐
│         NEXT.JS (Frontend + API Routes)              │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐   │
│  │      App Router (Owner + Penghuni)          │   │
│  │  /owner/dashboard, /owner/penghuni, etc     │   │
│  │  /penghuni/dashboard, /penghuni/pembayaran  │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │      API Routes (/api/...)                  │   │
│  │  Authentication, Data CRUD, File Upload     │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │      Middleware (Auth Check, Role-Based)    │   │
│  └──────────────────────────────────────────────┘   │
└────────────────┬──────────────┬────────────────────┘
                 │              │
        ┌────────▼──────────┐   │
        │  POSTGRESQL DB    │   │  ┌──────────────────┐
        │  (Prisma ORM)     │   └─▶│   CLOUDINARY     │
        │                  │      │  (KTP, Bukti,    │
        │  - Users         │      │   Dokumen)       │
        │  - Penghuni      │      └──────────────────┘
        │  - Kamar         │
        │  - Pembayaran    │      ┌──────────────────┐
        │  - Pengaduan     │      │  NEXTAUTH        │
        │  - etc           │      │  (Session)       │
        └─────────────────┘      └──────────────────┘
```

---

## ⚡ Performance Optimization

### Frontend Optimization
- Image optimization (Next.js Image component)
- Code splitting & lazy loading
- CSS purging (Tailwind)
- Minification & bundling
- Caching strategy

### Backend Optimization
- Database indexing (status, userId, etc)
- Query optimization (select specific fields)
- Connection pooling (Prisma)
- API response caching
- Pagination untuk list views

### Target Metrics
- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

---

## 🔐 Security Checklist

- ✅ HTTPS/TLS encryption
- ✅ Password hashing (bcryptjs)
- ✅ CSRF protection (Next.js built-in)
- ✅ XSS prevention (React escaping)
- ✅ SQL injection prevention (Prisma parameterized queries)
- ✅ Authentication middleware
- ✅ Role-based authorization
- ✅ File upload validation & sanitization
- ✅ Environment variables for secrets
- ✅ Rate limiting (untuk API)

---

## 📱 Mobile-First Approach

- Responsive design (Tailwind breakpoints)
- Touch-friendly buttons (min 48x48px)
- Optimized images untuk mobile
- Floating action button untuk pembayaran
- Bottom navigation (mobile)
- Viewport optimization

---

## 🧪 Testing Strategy

### Unit Tests
- Component rendering (Jest + React Testing Library)
- Utility functions
- Form validation

### Integration Tests
- API endpoints
- Database operations
- Authentication flow

### E2E Tests (Playwright/Cypress)
- Login flow
- Owner workflow (manage penghuni, kamar, pembayaran)
- Penghuni workflow (upload bukti, pengaduan)
- Checkout process

### Performance Testing
- Lighthouse CI
- Bundle size analysis
- Load testing

---

## 📚 Documentation Requirements

1. **API Documentation** (OpenAPI/Swagger)
2. **Database Schema** Documentation
3. **User Manual** (Owner + Penghuni)
4. **Developer Setup Guide**
5. **Deployment Guide**
6. **Troubleshooting Guide**

---

## 🚀 Environment Variables Template

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/koskita"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://koskita.com"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Payment Gateway (future)
# MIDTRANS_SERVER_KEY="..."
# MIDTRANS_CLIENT_KEY="..."
```

---

## 📈 Success Metrics

- Waktu loading dashboard < 1.5 detik
- Tidak ada Lighthouse warning
- 100% test coverage untuk critical paths
- User dapat upload KTP dalam < 30 detik
- Checkout automation 100% reliable
- Mobile responsiveness sempurna

---

**Last Updated:** November 19, 2025
