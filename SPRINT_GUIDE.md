# KOSKITA - Sprint Implementation Guide

## 🎯 Quick Start Commands

```bash
# Clone starter kit
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter koskita
cd koskita

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Initialize Prisma
npx prisma init

# Start development
npm run dev
```

---

## 📋 SPRINT 1: Project Setup & Dependencies

### Checklist
- [ ] Clone starter kit repository
- [ ] Install core dependencies
- [ ] Setup folder structure per plan
- [ ] Configure Tailwind + Shadcn/UI
- [ ] Initialize Git repository
- [ ] Create .gitignore & .env files

### Commands to Execute

```bash
# 1. Install main packages
npm install framer-motion
npm install next-auth@5.0.0-beta
npm install @prisma/client prisma
npm install next-cloudinary
npm install react-hook-form zod
npm install axios
npm install bcryptjs
npm install -D @types/bcryptjs

# 2. Setup Shadcn/UI (if not already in starter)
npx shadcn-ui@latest init -d

# 3. Add specific components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea

# 4. Initialize Prisma
npx prisma init
```

### Folder Structure to Create

```bash
mkdir -p app/(auth)/login
mkdir -p app/(owner)/{dashboard,penghuni,kamar,keuangan,laporan}
mkdir -p app/(penghuni)/{dashboard,pembayaran,pengaduan,akun}
mkdir -p app/api/{auth,owner,penghuni,upload}
mkdir -p components/{ui,auth,owner,penghuni,shared}
mkdir -p lib
mkdir -p prisma
```

### Key Configuration Files

**`tailwind.config.ts` - Add Gen Z Color Palette:**
```typescript
const config = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#6366F1',
        'brand-secondary': '#EC4899',
        'brand-success': '#10B981',
        'brand-warning': '#F59E0B',
        'brand-danger': '#EF4444',
      },
      animation: {
        'float-label': 'floatLabel 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        floatLabel: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(-24px)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}
```

---

## 📋 SPRINT 2: Database Schema & Prisma Setup

### Checklist
- [ ] Create `.env.local` dengan database connection string
- [ ] Write Prisma schema (lihat di TECHNICAL_PLANNING.md)
- [ ] Run `npx prisma migrate dev --name init`
- [ ] Generate Prisma client
- [ ] Create seed file (optional: populate test data)
- [ ] Verify schema dengan `npx prisma studio`

### Steps

```bash
# 1. Setup .env.local
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/koskita_dev"' > .env.local

# 2. Copy schema.prisma dari TECHNICAL_PLANNING.md ke prisma/schema.prisma

# 3. Create migration
npx prisma migrate dev --name init

# 4. Open Prisma Studio (visualization tool)
npx prisma studio

# 5. (Optional) Create seed file
echo 'import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  const owner = await db.owner.create({
    data: {
      namaKos: "Kos TestKu",
      alamat: "Jl. Test No. 123",
      noTelepon: "081234567890",
      user: {
        create: {
          email: "owner@test.com",
          passwordHash: "$2a$10$...", // bcrypt hash dari "password"
          role: "OWNER",
        },
      },
    },
  });
  console.log("Seeded owner:", owner);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });' > prisma/seed.ts
```

---

## 📋 SPRINT 3: Authentication & Login System

### Checklist
- [ ] Setup NextAuth configuration
- [ ] Create login page dengan Gen Z UI
- [ ] Create auth middleware
- [ ] Test login dengan credentials
- [ ] Test redirect logic (owner vs penghuni)
- [ ] Create logout functionality

### Implementation Files

**`auth.ts` - Auth Configuration:**

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/prisma'

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password harus diisi')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) {
          throw new Error('Email tidak ditemukan')
        }

        if (!user.isActive) {
          throw new Error('Akun Anda telah dinonaktifkan')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) {
          throw new Error('Password salah')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname
      const isLoggedIn = !!auth?.user

      if (pathname.startsWith('/owner') && (!isLoggedIn || auth?.user?.role !== 'OWNER')) {
        return false
      }

      if (pathname.startsWith('/penghuni') && (!isLoggedIn || auth?.user?.role !== 'PENGHUNI')) {
        return false
      }

      return true
    },
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
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 hari
  },
})
```

**`middleware.ts` - Route Protection:**

```typescript
import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export const middleware = auth((req: any) => {
  const pathname = req.nextUrl.pathname
  const isLoggedIn = !!req.auth?.user

  // Redirect to login if not authenticated
  if (
    !isLoggedIn &&
    (pathname.startsWith('/owner') || pathname.startsWith('/penghuni'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Auto-redirect based on role
  if (pathname === '/' && isLoggedIn) {
    const role = req.auth?.user?.role
    const redirect =
      role === 'OWNER' ? '/owner/dashboard' : '/penghuni/dashboard'
    return NextResponse.redirect(new URL(redirect, req.url))
  }

  // Role-based access control
  if (pathname.startsWith('/owner') && req.auth?.user?.role !== 'OWNER') {
    return NextResponse.redirect(new URL('/penghuni/dashboard', req.url))
  }

  if (pathname.startsWith('/penghuni') && req.auth?.user?.role !== 'PENGHUNI') {
    return NextResponse.redirect(new URL('/owner/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

**`app/(auth)/login/page.tsx` - Login Page with Gen Z UI:**

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!result?.ok) {
        setError(result?.error || 'Login gagal')
        return
      }

      router.push('/owner/dashboard')
    } catch (err) {
      setError('Terjadi kesalahan. Silahkan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent mb-2">
            KOSKITA
          </h1>
          <p className="text-slate-600 text-sm">
            Platform Manajemen Kos-Kosan Modern
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8"
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <motion.div variants={itemVariants} className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pt-6 pb-2 px-4 rounded-xl border-slate-200 focus:border-brand-primary transition-colors"
                required
              />
              <label className="absolute left-4 top-2 text-xs text-slate-500">
                Email Address
              </label>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pt-6 pb-2 px-4 rounded-xl border-slate-200 focus:border-brand-primary transition-colors"
                required
              />
              <label className="absolute left-4 top-2 text-xs text-slate-500">
                Password
              </label>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                variants={itemVariants}
                className="p-3 bg-brand-danger/10 border border-brand-danger/20 rounded-lg text-brand-danger text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:shadow-lg transition-all rounded-xl py-2 h-11"
              >
                {loading ? 'Loading...' : 'Masuk'}
              </Button>
            </motion.div>
          </form>

          {/* Demo Credentials */}
          <motion.div variants={itemVariants} className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">
              Demo Credentials:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Owner:</span>
                <code className="bg-slate-100 px-2 py-1 rounded">
                  owner@test.com / password
                </code>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Penghuni:</span>
                <code className="bg-slate-100 px-2 py-1 rounded">
                  penghuni@test.com / password
                </code>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="text-center text-xs text-slate-500 mt-6"
        >
          KOSKITA © 2025. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  )
}
```

---

## 📋 SPRINT 4-5: UI Components & Design System

### Checklist
- [ ] Create custom `FloatLabelInput` component
- [ ] Create `StatusBadge` component untuk kamar
- [ ] Create `RoomCard` component
- [ ] Create `PaymentProgressBar` component
- [ ] Setup Framer Motion page transitions
- [ ] Create layout components (sidebar, topbar)

### Custom Components to Create

```typescript
// components/ui/float-label-input.tsx
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

```typescript
// components/shared/status-badge.tsx
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: 'KOSONG' | 'TERISI' | 'AKAN_KOSONG' | 'MAINTENANCE'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    KOSONG: 'bg-brand-success/10 text-brand-success',
    TERISI: 'bg-brand-danger/10 text-brand-danger',
    AKAN_KOSONG: 'bg-brand-warning/10 text-brand-warning',
    MAINTENANCE: 'bg-slate-200/50 text-slate-700',
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

## 🔄 Key Implementation Patterns

### API Route Handler Pattern
```typescript
// app/api/owner/penghuni/route.ts
import { auth } from '@/auth'
import { db } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'OWNER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const penghuni = await db.penghuni.findMany({
    where: { ownerId: session.user.id },
    include: { kamar: true, user: { select: { email: true } } },
  })

  return NextResponse.json(penghuni)
}
```

### Form Handling Pattern
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const response = await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    // Handle response
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 🚀 Next Steps After Sprint 3

1. Start Sprint 4 (UI Components)
2. Parallel: Begin Sprint 2 (Database) implementation
3. Once Database ready: Begin Sprint 3 (Auth) API endpoints
4. Continue with Owner Dashboard features

---

## 📝 Testing Each Sprint

### Sprint 1 Verification
```bash
npm run build  # Should complete without errors
npm run dev    # Should start on http://localhost:3000
```

### Sprint 2 Verification
```bash
npx prisma studio  # Verify schema created correctly
npx prisma db seed # (Optional) Verify seed data
```

### Sprint 3 Verification
- [ ] Can login dengan email/password yang valid
- [ ] Invalid credentials menunjukkan error message
- [ ] Setelah login, owner diarahkan ke `/owner/dashboard`
- [ ] Setelah login, penghuni diarahkan ke `/penghuni/dashboard`
- [ ] Tidak bisa akses `/owner/*` jika role bukan OWNER
- [ ] Logout functionality works

---

## ⚡ Performance Tips During Development

1. Use `Next.js Image` untuk semua images
2. Lazy load heavy components dengan `dynamic()`
3. Memoize components yang tidak perlu frequent re-render
4. Use `useCallback` untuk event handlers di list
5. Profile dengan Chrome DevTools Lighthouse

---

Last Updated: November 19, 2025
