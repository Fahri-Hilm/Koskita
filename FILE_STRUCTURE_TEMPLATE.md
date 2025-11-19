# KOSKITA - File Structure Template

Gunakan file ini untuk setup folder structure proyek dengan cepat menggunakan terminal commands.

## Bash Script untuk Create Folder Structure

### Save as: `setup-structure.sh`

```bash
#!/bin/bash

# Create main app folders
mkdir -p app/{auth,owner,penghuni,api}/
mkdir -p app/\(auth\)/login
mkdir -p app/\(owner\)/{dashboard,penghuni,kamar,keuangan/pembayaran,keuangan/laporan,pengaduan,checkout}
mkdir -p app/\(penghuni\)/{dashboard,pembayaran,pengaduan,akun}
mkdir -p app/api/auth/\[...nextauth\]
mkdir -p app/api/owner/{penghuni,kamar,pembayaran,pengaduan,laporan,checkout}
mkdir -p app/api/penghuni/{dashboard,pembayaran,pengaduan,akun,checkout-request}
mkdir -p app/api/upload/{ktp,bukti-transfer,pengaduan}

# Create components folders
mkdir -p components/{ui,auth,owner,penghuni,shared,layout}

# Create lib folder
mkdir -p lib

# Create prisma folder
mkdir -p prisma

# Create public folder
mkdir -p public/images

echo "✅ Folder structure created successfully!"
```

### Run Commands

```bash
# Make script executable
chmod +x setup-structure.sh

# Run script
./setup-structure.sh
```

---

## Template Files untuk Setiap Route

### 1. Root Layout
**File:** `app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/components/layout/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KOSKITA - Manajemen Kos-Kosan',
  description: 'Platform modern untuk mengelola kos-kosan dengan mudah',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

### 2. Login Page
**File:** `app/(auth)/login/page.tsx`

```typescript
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <LoginForm />
    </div>
  )
}
```

### 3. Owner Dashboard
**File:** `app/(owner)/dashboard/page.tsx`

```typescript
import { OwnerLayout } from '@/components/layout/owner-layout'

export default function OwnerDashboard() {
  return (
    <OwnerLayout>
      {/* Dashboard content */}
    </OwnerLayout>
  )
}
```

### 4. API Route Template
**File:** `app/api/owner/penghuni/route.ts`

```typescript
import { auth } from '@/auth'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const penghuni = await db.penghuni.findMany({
      where: { ownerId: session.user.id },
      include: { kamar: true, user: { select: { email: true } } },
    })

    return NextResponse.json(penghuni)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    const penghuni = await db.penghuni.create({
      data: {
        ...data,
        ownerId: session.user.id,
      },
    })

    return NextResponse.json(penghuni, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create penghuni' },
      { status: 400 }
    )
  }
}
```

---

## Utility Files

### Authentication Library
**File:** `lib/auth.ts`

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.isActive) {
          throw new Error('Email atau password salah')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Email atau password salah')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
})
```

### Prisma Client
**File:** `lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Cloudinary Utilities
**File:** `lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadKTP(file: File, penghuniId: string) {
  const buffer = await file.arrayBuffer()

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'koskita/ktp',
        public_id: `penghuni_${penghuniId}`,
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result?.secure_url)
      }
    )

    stream.end(Buffer.from(buffer))
  })
}

export async function deleteImage(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
```

### Validation Schemas
**File:** `lib/validations.ts`

```typescript
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
```

---

## Component Templates

### FloatLabelInput Component
**File:** `components/ui/float-label-input.tsx`

```typescript
'use client'

import { useState, forwardRef, InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface FloatLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const FloatLabelInput = forwardRef<HTMLInputElement, FloatLabelInputProps>(
  ({ label, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    return (
      <div className="relative">
        <input
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            setHasValue(!!e.target.value)
            props.onChange?.(e)
          }}
          className={`peer w-full pt-6 pb-2 px-4 bg-white border border-slate-200 rounded-xl transition-all duration-200 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 ${className}`}
          {...props}
        />
        {label && (
          <motion.label
            animate={{
              y: isFocused || hasValue ? -20 : 0,
              fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
              color: isFocused ? '#6366F1' : '#64748B',
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-4 origin-top-left pointer-events-none"
          >
            {label}
          </motion.label>
        )}
      </div>
    )
  }
)

FloatLabelInput.displayName = 'FloatLabelInput'
```

### StatusBadge Component
**File:** `components/shared/status-badge.tsx`

```typescript
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    KOSONG: 'bg-green-100 text-green-700',
    TERISI: 'bg-red-100 text-red-700',
    AKAN_KOSONG: 'bg-yellow-100 text-yellow-700',
    MAINTENANCE: 'bg-gray-100 text-gray-700',
  }

  const labels = {
    KOSONG: 'Kosong',
    TERISI: 'Terisi',
    AKAN_KOSONG: 'Akan Kosong',
    MAINTENANCE: 'Perawatan',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  )
}
```

---

## Environment Variables Template
**File:** `.env.local`

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/koskita_dev"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-hex-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Optional - Payment Gateway (untuk Phase 2)
# MIDTRANS_SERVER_KEY="..."
# MIDTRANS_CLIENT_KEY="..."
```

---

## Checklist untuk Setup Setiap Feature

### Checklist: New API Endpoint
- [ ] Create route file di `app/api/...`
- [ ] Add authentication check
- [ ] Add input validation dengan Zod
- [ ] Add error handling
- [ ] Test dengan Postman/Thunder Client
- [ ] Add to API_REFERENCE.md

### Checklist: New Page
- [ ] Create folder di `app/...`
- [ ] Create `page.tsx`
- [ ] Add layout wrapper (OwnerLayout/TenantLayout)
- [ ] Create component file (jika needed)
- [ ] Add to navigation
- [ ] Test responsiveness

### Checklist: New Database Model
- [ ] Add to `prisma/schema.prisma`
- [ ] Create migration: `npx prisma migrate dev --name feature_name`
- [ ] Generate Prisma client
- [ ] Create API endpoints untuk CRUD
- [ ] Update documentation

---

## Quick Commands Reference

```bash
# Prisma
npx prisma migrate dev --name feature_name   # Create migration
npx prisma studio                             # Open DB GUI
npx prisma generate                           # Regenerate client

# Next.js
npm run dev                                   # Start dev server
npm run build                                 # Build for production
npm run lint                                  # Check linting

# Database
npx prisma db push                            # Push schema ke DB
npx prisma db seed                            # Run seed file
npx prisma db reset                           # Reset DB (drop all data)

# Utilities
openssl rand -hex 32                          # Generate NEXTAUTH_SECRET
```

---

## Notes

1. Semua file template sudah siap digunakan
2. Replace `SESSION_USER_ID` dengan actual user ID dari session
3. Update imports sesuai dengan path actual
4. Test setiap fitur sebelum production
5. Keep documentation updated

---

Last Updated: November 19, 2025
