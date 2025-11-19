# KOSKITA - Development Resources & Quick Tips

## 📚 Resource Links

### Official Documentation
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [NextAuth.js v5 Documentation](https://authjs.dev/)
- [Prisma ORM Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

### Learning Resources
- [Next.js Learn Course (Free)](https://nextjs.org/learn)
- [Prisma University (Free)](https://www.prisma.io/learn)
- [Tailwind CSS Course](https://tailwindcss.com/docs/customizing-colors)
- [React Hook Form Guide](https://react-hook-form.com/)
- [Zod Validation Library](https://zod.dev/)

### Tools & Libraries
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Railway Database Hosting](https://railway.app/)
- [Postman API Testing](https://www.postman.com/)
- [Thunder Client (VS Code Extension)](https://www.thunderclient.com/)

---

## ⚡ Quick Implementation Tips

### 1. Setup Faster dengan Template

```bash
# Instead of cloning starter kit, use create-next-app
npx create-next-app@latest koskita --typescript --tailwind --eslint

# Then manually add:
# - shadcn/ui
# - nextauth
# - prisma
# - other dependencies
```

### 2. Prisma Quick Setup

```bash
# Create schema faster
npx prisma db push  # Jika DB sudah ada
npx prisma migrate dev --name init  # Jika buat baru

# Instant GUI untuk database
npx prisma studio
```

### 3. NextAuth Quick Config

```typescript
// auth.ts - Minimal setup
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Your auth logic here
        return { id: '1', email: credentials.email }
      },
    }),
  ],
})
```

### 4. Shadcn/UI Component Quick Add

```bash
# Add multiple at once
npx shadcn-ui@latest add button input card dialog badge

# For all components at once
npx shadcn-ui@latest add $(curl -s https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/registry/index.json | jq -r '.[].name' | tr '\n' ' ')
```

### 5. Database Indexing Strategy

```prisma
// Add indexes untuk query yang sering digunakan
model Penghuni {
  id String @id @default(cuid())
  ownerId String
  statusSewa String
  
  @@index([ownerId]) // Query by owner
  @@index([statusSewa]) // Filter by status
  @@unique([ownerId, noIdentitas]) // Prevent duplicates
}
```

### 6. API Route Caching Strategy

```typescript
// Cache responses untuk data yang jarang berubah
export const revalidate = 60 // Revalidate setiap 60 detik

// Atau gunakan
export async function GET() {
  // Fetch data
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  })
}
```

### 7. Image Optimization

```typescript
// Selalu gunakan next/image
import Image from 'next/image'

<Image
  src="/user.jpg"
  alt="User"
  width={200}
  height={200}
  priority // Untuk above-fold images
  placeholder="blur" // Untuk loading skeleton
/>

// Cloudinary URL transformation
const optimizedUrl = `${imageUrl}?w=400&q=auto&f=webp`
```

### 8. Mobile-First Breakpoints (Tailwind)

```typescript
// Dalam components, mulai dari mobile
<div className="p-4 md:p-6 lg:p-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Responsive grid */}
  </div>
</div>
```

### 9. Form Validation dengan Zod

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  noTelepon: z.string().regex(/^08\d{9,11}$/, 'No telepon tidak valid'),
  hargaSewa: z.number().min(100000, 'Minimal 100ribu'),
})

type FormData = z.infer<typeof schema>
```

### 10. Error Handling Pattern

```typescript
export async function GET(req: Request) {
  try {
    const data = await db.kamar.findMany()
    return Response.json(data)
  } catch (error) {
    console.error('Database error:', error)
    return Response.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    )
  }
}
```

### 11. Progressive Image Loading

```typescript
// lib/image-utils.ts
export const getImageURL = (url: string, width: number) => {
  return `${url}?w=${width}&q=auto&f=webp`
}

// Usage
<Image
  src={getImageURL(imageUrl, 400)}
  alt="KTP"
  placeholder="blur"
  blurDataURL={blurredBase64}
/>
```

### 12. State Management (Simple dengan Context)

```typescript
// lib/context.ts
'use client'
import { createContext } from 'react'

export const UserContext = createContext(null)

// app/layout.tsx
<UserContext.Provider value={userData}>
  {children}
</UserContext.Provider>

// Dalam component
const userData = useContext(UserContext)
```

### 13. API Pagination Pattern

```typescript
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    db.penghuni.findMany({ skip, take: limit }),
    db.penghuni.count(),
  ])

  return Response.json({
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}
```

### 14. Batch Operations (Untuk Performance)

```typescript
// Jangan lakukan loop insert
// ❌ SLOW
for (const tenant of tenants) {
  await db.penghuni.create({ data: tenant })
}

// ✅ FAST
await db.penghuni.createMany({
  data: tenants,
  skipDuplicates: true,
})
```

### 15. Database Transaction untuk Data Consistency

```typescript
await db.$transaction(async (tx) => {
  // Semua queries di sini atomic (all or nothing)
  await tx.kamar.update({ ... })
  await tx.penghuni.update({ ... })
  await tx.user.update({ ... })
})
```

---

## 🔍 Common Issues & Solutions

### Issue: NextAuth Login Tidak Bekerja
**Solution:**
```typescript
// 1. Pastikan NEXTAUTH_SECRET di .env.local
NEXTAUTH_SECRET=$(openssl rand -hex 32)

// 2. Pastikan database connected
npx prisma db push

// 3. Pastikan middleware.ts correct
// Middleware harus di root project directory
```

### Issue: Cloudinary Upload Gagal
**Solution:**
```typescript
// 1. Verify credentials
console.log(process.env.CLOUDINARY_CLOUD_NAME)

// 2. Check CORS settings di Cloudinary dashboard
// 3. Verify upload signature (untuk unsigned uploads)
// 4. Check file size < 100MB
```

### Issue: Prisma Query Slow
**Solution:**
```typescript
// 1. Add indexes
@@index([fieldName])

// 2. Use select() untuk tidak fetch semua fields
.findMany({
  select: { id: true, name: true } // Tidak select { * }
})

// 3. Use pagination
.findMany({ take: 10, skip: 0 })

// 4. Use include dengan conditions
.findMany({
  include: {
    penghuni: { select: { namaLengkap: true } }
  }
})
```

### Issue: Build Error di Vercel
**Solution:**
```bash
# 1. Check build locally
npm run build

# 2. Install missing dependencies
npm install <package>

# 3. Clear Vercel cache
# Go to Vercel dashboard → Settings → Deployments → Clear Cache

# 4. Check environment variables di Vercel
# Settings → Environment Variables (must match .env.local)
```

### Issue: CORS Error di API
**Solution:**
```typescript
// Tambahkan CORS headers
export async function GET(req: Request) {
  const response = Response.json({ data: 'ok' })
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}

// Atau gunakan Next.js CORS middleware
```

### Issue: Flash of Unstyled Content (FOUC)
**Solution:**
```typescript
// Tambahkan suppressHydrationWarning
<html suppressHydrationWarning>
  <body>
    {children}
  </body>
</html>

// Atau gunakan NoSSR wrapper
const Component = dynamic(() => import('...'), { ssr: false })
```

---

## 📊 Performance Optimization Checklist

### Frontend
- [ ] Image optimization (next/image)
- [ ] Code splitting (dynamic imports)
- [ ] Minification & bundling (automatic di Next.js)
- [ ] CSS purging (Tailwind)
- [ ] Font optimization (next/font)
- [ ] Script optimization (next/script)

### Backend
- [ ] Database indexing
- [ ] Query optimization (select specific fields)
- [ ] Connection pooling (Prisma)
- [ ] Caching strategy
- [ ] API response compression (gzip)

### Metrics Target
- **Lighthouse Score:** 90+
- **First Contentful Paint (FCP):** < 1.5s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3s

---

## 🔐 Security Checklist

### Authentication & Authorization
- [ ] Password hashing (bcryptjs)
- [ ] HTTPS/TLS only
- [ ] CSRF protection (built-in Next.js)
- [ ] Rate limiting on login
- [ ] Session timeout (7 hari)

### Data Protection
- [ ] Input validation (Zod)
- [ ] SQL injection prevention (Prisma parameterized)
- [ ] XSS prevention (React escaping)
- [ ] Sensitive data masking (KTP, no telepon)
- [ ] Audit logging (siapa mengakses apa)

### API Security
- [ ] Authentication on all routes
- [ ] Role-based authorization
- [ ] Rate limiting
- [ ] Input validation
- [ ] Output encoding

### File Upload Security
- [ ] File type validation
- [ ] File size limits (< 5MB)
- [ ] Filename sanitization
- [ ] Virus scanning (optional, Cloudinary)
- [ ] Secure storage (Cloudinary)

---

## 🎯 Testing Best Practices

### Unit Testing
```typescript
// Example: test utility function
import { describe, it, expect } from '@jest/globals'

describe('formatPhone', () => {
  it('should format phone number correctly', () => {
    expect(formatPhone('081234567890')).toBe('+62812-3456-7890')
  })
})
```

### Integration Testing
```typescript
// Example: test API endpoint
import { POST } from '@/app/api/auth/signin/route'

describe('Sign In API', () => {
  it('should return error for invalid credentials', async () => {
    const res = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'wrong' }),
      })
    )
    expect(res.status).toBe(401)
  })
})
```

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import LoginPage from '@/app/(auth)/login/page'

describe('LoginPage', () => {
  it('should render login form', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
})
```

---

## 📝 Code Style & Standards

### TypeScript Best Practices
```typescript
// ✅ Type everything
interface Penghuni {
  id: string
  namaLengkap: string
  statusSewa: 'AKTIF' | 'NON_AKTIF'
}

// ❌ Avoid any
const data: any = await fetch(...)

// ✅ Use strict mode
// tsconfig.json: "strict": true
```

### Component Naming
```typescript
// ✅ Clear, descriptive names
export function TenantListPage() {}
export function RoomStatusBadge() {}
export function PaymentUploadForm() {}

// ❌ Generic names
export function Page() {}
export function Badge() {}
export function Form() {}
```

### File Organization
```
components/
├── ui/                 # Shadcn components
├── auth/               # Auth-related components
├── owner/              # Owner-specific components
│   ├── TenantList.tsx
│   ├── RoomGrid.tsx
│   └── PaymentTable.tsx
├── penghuni/           # Tenant-specific components
├── shared/             # Shared components
└── layout/             # Layout components
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] No security vulnerabilities
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Lighthouse audit passed

### Vercel Deployment
```bash
# 1. Create vercel.json
{
  "buildCommand": "next build",
  "installCommand": "npm ci",
  "outputDirectory": ".next"
}

# 2. Connect GitHub repo
# https://vercel.com/new

# 3. Set environment variables
# Settings → Environment Variables

# 4. Deploy
# Automatic on push to main
```

### Post-Deployment
- [ ] Verify all features work on production
- [ ] Test on production database
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify HTTPS working
- [ ] Test SSL certificate

---

## 📞 Getting Help

### Community Resources
- [Next.js Discord](https://discord.gg/nextjs)
- [Prisma Slack Community](https://slack.prisma.io/)
- [Tailwind CSS Discord](https://discord.gg/7NF8agS)
- [React Discussions](https://github.com/facebook/react/discussions)

### Troubleshooting Commands
```bash
# Clear everything and start fresh
rm -rf node_modules .next .env.local
npm install
npx prisma db push
npm run dev

# Check for errors
npm run lint
npm run build

# Check dependencies
npm outdated
npm audit
npm audit fix
```

---

## 💡 Pro Tips

### 1. Use Keyboard Shortcuts
- `Ctrl+Shift+D`: Open Next.js dev tools
- `Ctrl+K`: Open Next.js search (docs)
- `F12`: Open browser DevTools

### 2. Debug dengan Console
```typescript
// Useful for debugging
console.table(data) // Format data as table
console.time('query') // Measure performance
console.log('%c Text', 'color: blue; font-size: 16px') // Styled logs
```

### 3. Use VS Code Extensions
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind
- **Prisma** - Prisma syntax highlighting
- **Thunder Client** - API testing in VS Code
- **Error Lens** - Show errors inline
- **REST Client** - Test APIs from VS Code

### 4. Environment Variables Organization
```env
# .env.local structure
# Database
DATABASE_URL=...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...

# External Services
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 5. Git Workflow
```bash
# Create feature branch
git checkout -b feature/penghuni-management

# Commit frequently with clear messages
git commit -m "feat: add penghuni CRUD operations"

# Push and create PR
git push origin feature/penghuni-management

# Merge after review
git checkout main
git pull
git merge feature/penghuni-management
```

---

## 📈 Success Metrics

Track these metrics untuk measure success:

1. **Time to First Byte (TTFB):** < 200ms
2. **Largest Contentful Paint (LCP):** < 2.5s
3. **First Input Delay (FID):** < 100ms
4. **Cumulative Layout Shift (CLS):** < 0.1
5. **Page Load Time:** < 3s
6. **Lighthouse Score:** 90+
7. **Mobile Friendliness:** 100%
8. **API Response Time:** < 500ms
9. **Error Rate:** < 0.1%
10. **Uptime:** > 99.9%

---

## ✨ Next Steps

1. **Read through all documentation** (especially TECHNICAL_PLANNING.md)
2. **Setup development environment** (follow SPRINT_GUIDE.md Sprint 1)
3. **Start with Sprint 1-2** (Foundation & Database)
4. **Use checklist** (IMPLEMENTATION_CHECKLIST.md)
5. **Reference APIs** (API_REFERENCE.md)
6. **Ask questions** in community if stuck

---

**Good luck with KOSKITA! 🚀**

Last Updated: November 19, 2025
