# 🏠 KOSKITA - Platform Manajemen Kos-Kosan Modern

**KOSKITA** adalah platform web modern untuk mengelola kos-kosan dengan sistem role-based access (Owner & Penghuni), desain Gen Z yang minimalis, dan performa ringan.

---

## 📋 Daftar Isi

1. [Quick Start](#quick-start)
2. [Fitur Utama](#fitur-utama)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Documentation](#documentation)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- PostgreSQL / MySQL ([Download](https://www.postgresql.org))
- Cloudinary Account ([Free Tier](https://cloudinary.com/users/register/free))
- GitHub Account (untuk clone & deployment)

### Installation

```bash
# 1. Clone starter kit
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter koskita
cd koskita

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# 4. Setup database
npx prisma migrate dev --name init

# 5. Run development server
npm run dev
```

**Server akan berjalan di:** `http://localhost:3000`

### Login Demo

Gunakan credentials berikut untuk testing:

**Owner Account:**
```
Email: owner@test.com
Password: password
```

**Penghuni Account:**
```
Email: penghuni@test.com
Password: password
```

---

## ✨ Fitur Utama

### 👤 Sistem Autentikasi
- ✅ Single login page untuk semua pengguna
- ✅ Auto-redirect berdasarkan role (Owner / Penghuni)
- ✅ Float label animation (Gen Z aesthetic)
- ✅ Secure password hashing (bcryptjs)
- ✅ Session management (7 hari)

### 🏢 Dashboard Owner

#### A. Manajemen Penghuni & Data Legal
- ✅ List penghuni dengan search & filter
- ✅ Add penghuni baru (input lengkap)
- ✅ **Upload Foto KTP** (stored di Cloudinary)
- ✅ Edit data penghuni
- ✅ Soft delete penghuni
- ✅ Notifikasi kontrak berakhir

#### B. Manajemen Kamar & Properti
- ✅ Kamar list dengan grid/table view
- ✅ Color-coded status (Kosong/Terisi/Akan Kosong)
- ✅ Add kamar & setting tarif
- ✅ Edit tipe & fasilitas kamar
- ✅ Real-time status updates

#### C. Manajemen Keuangan
- ✅ Record pembayaran sewa
- ✅ Verifikasi bukti transfer
- ✅ Status pembayaran per penghuni (Lunas/Pending/Jatuh Tempo)
- ✅ Laporan keuangan (bulanan/tahunan)
- ✅ Export report (PDF/Excel)
- ✅ Debt tracking & reminder

#### D. Komunikasi & Operasional
- ✅ Kotak masuk pengaduan dari penghuni
- ✅ Update status pengaduan (Baru/Diproses/Selesai)
- ✅ Broadcast notifikasi massal ke penghuni
- ✅ Notification log & history

#### E. Manajemen Check-out
- ✅ Daftar permintaan check-out
- ✅ Verifikasi administrasi & pembayaran
- ✅ Auto-finalize dengan database transaction:
  - Ubah status kamar ke Kosong
  - Archive data penghuni
  - Nonaktifkan akun login penghuni

### 🏠 Dashboard Penghuni

#### A. Menu Utama & Keuangan
- ✅ Landing page (snapshot info sewa)
  - Nomor kamar, tipe, harga, jatuh tempo
  - Progress bar animasi (sisa hari)
- ✅ Payment center
  - Upload bukti transfer (drag-drop)
  - Riwayat pembayaran
  - Status verifikasi Owner
- ✅ Pengaduan & perbaikan
  - Form submit pengaduan
  - Tracking status pengaduan

#### B. Menu Administrasi & Komunikasi
- ✅ Akses dokumen kontrak sewa & peraturan
- ✅ Notifikasi inbox
- ✅ Pengaturan akun (update data kontak)
- ✅ Ganti password
- ✅ Pengajuan check-out (dengan tracking)

---

## 🏗️ Tech Stack

### Frontend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 14+ | Framework React dengan SSR |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3+ | Styling & responsive design |
| **Shadcn/UI** | Latest | Pre-built UI components |
| **Framer Motion** | 10+ | Smooth animations |
| **React Hook Form** | 7+ | Form handling |
| **Zod** | 3+ | Schema validation |

### Backend
| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js API Routes** | 14+ | Backend API |
| **NextAuth.js** | 5+ | Authentication |
| **Prisma ORM** | 5+ | Database management |
| **bcryptjs** | 2.4+ | Password hashing |

### Database & Storage
| Teknologi | Fungsi |
|-----------|--------|
| **PostgreSQL** | Primary database |
| **Cloudinary** | Image/file storage |

### Deployment
| Platform | Fungsi |
|----------|--------|
| **Vercel** | Frontend & API hosting |
| **Railway/Vercel Postgres** | Database hosting |

---

## 📁 Project Structure

```
koskita/
├── app/
│   ├── (auth)/
│   │   └── login/                    # Login page
│   │       └── page.tsx
│   │
│   ├── (owner)/                      # Owner routes (protected)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Owner dashboard
│   │   ├── penghuni/
│   │   │   ├── page.tsx              # Penghuni list
│   │   │   └── [id]/page.tsx         # Penghuni detail
│   │   ├── kamar/
│   │   │   └── page.tsx              # Kamar management
│   │   ├── keuangan/
│   │   │   ├── pembayaran/page.tsx
│   │   │   └── laporan/page.tsx
│   │   ├── pengaduan/page.tsx        # Complaint management
│   │   └── checkout/page.tsx         # Check-out requests
│   │
│   ├── (penghuni)/                   # Penghuni routes (protected)
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Tenant dashboard
│   │   ├── pembayaran/
│   │   │   └── page.tsx              # Payment center
│   │   ├── pengaduan/
│   │   │   └── page.tsx              # Complaint submission
│   │   └── akun/
│   │       └── page.tsx              # Account settings
│   │
│   ├── api/
│   │   ├── auth/                     # NextAuth routes
│   │   │   └── [...nextauth]/route.ts
│   │   │
│   │   ├── owner/
│   │   │   ├── penghuni/route.ts     # GET, POST penghuni
│   │   │   ├── kamar/route.ts        # GET, POST kamar
│   │   │   ├── pembayaran/route.ts
│   │   │   ├── pengaduan/route.ts
│   │   │   ├── laporan/route.ts
│   │   │   └── checkout/route.ts
│   │   │
│   │   ├── penghuni/
│   │   │   ├── dashboard/route.ts
│   │   │   ├── pembayaran/route.ts
│   │   │   ├── pengaduan/route.ts
│   │   │   ├── akun/route.ts
│   │   │   └── checkout-request/route.ts
│   │   │
│   │   └── upload/                   # File upload
│   │       ├── ktp/route.ts
│   │       ├── bukti-transfer/route.ts
│   │       └── pengaduan/route.ts
│   │
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page / redirect
│
├── components/
│   ├── ui/                           # Shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   └── ...more
│   │
│   ├── auth/
│   │   └── LoginForm.tsx             # Custom login form
│   │
│   ├── owner/
│   │   ├── TenantList.tsx
│   │   ├── RoomGrid.tsx
│   │   ├── PaymentTable.tsx
│   │   ├── ReportGenerator.tsx
│   │   └── CheckoutForm.tsx
│   │
│   ├── penghuni/
│   │   ├── RentalInfo.tsx            # Rental information
│   │   ├── PaymentUploadForm.tsx     # Upload bukti
│   │   ├── ComplaintForm.tsx
│   │   └── DashboardCard.tsx
│   │
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatusBadge.tsx           # Color-coded status
│   │   ├── ProgressBar.tsx           # Sisa hari
│   │   ├── UploadZone.tsx            # Drag-drop uploader
│   │   └── LoadingSpinner.tsx
│   │
│   └── layout/
│       ├── OwnerLayout.tsx
│       └── TenantLayout.tsx
│
├── lib/
│   ├── auth.ts                       # NextAuth config
│   ├── prisma.ts                     # Prisma client (singleton)
│   ├── cloudinary.ts                 # Cloudinary utilities
│   ├── utils.ts                      # Helper functions
│   └── validations.ts                # Zod schemas
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── public/
│   └── images/
│       └── logo.png
│
├── middleware.ts                      # NextAuth middleware
├── .env.local                         # Environment variables
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📚 Documentation

### Main Documentation Files
1. **[TECHNICAL_PLANNING.md](./TECHNICAL_PLANNING.md)** - Perencanaan teknis lengkap
   - System architecture
   - Database schema details
   - API overview
   - Technology stack justification

2. **[SPRINT_GUIDE.md](./SPRINT_GUIDE.md)** - Panduan implementasi per sprint
   - Detailed checklist setiap sprint
   - Code examples & patterns
   - Implementation tips

3. **[API_REFERENCE.md](./API_REFERENCE.md)** - Referensi lengkap API
   - Semua endpoint details
   - Request/response format
   - Contoh usage & testing

4. **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Checklist implementasi
   - Sprint-by-sprint checklist
   - Dependencies to install
   - Feature requirements per sprint

5. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Tips & resources
   - Implementation tips & tricks
   - Common issues & solutions
   - Resource links
   - Performance optimization

---

## 💻 Development

### Setup Development Environment

```bash
# 1. Install dependencies
npm install

# 2. Setup .env.local
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DATABASE_URL=postgresql://user:password@localhost/koskita_dev
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://localhost:3000
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Run tests (when setup)
npm run test

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Code Quality

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for ESLint issues
npm run lint

# Format code with Prettier
npm run format
```

---

## 🚀 Deployment

### Deploy ke Vercel

1. **Push ke GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect ke Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import GitHub repository
   - Configure environment variables

3. **Set Environment Variables di Vercel**
```
DATABASE_URL = your_production_db
NEXTAUTH_SECRET = generated_secret
NEXTAUTH_URL = https://your-domain.com
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

4. **Deploy**
   - Vercel otomatis deploy setiap push ke `main`
   - Preview URL untuk setiap PR

### Custom Domain

1. Go to Vercel project settings
2. Domains → Add custom domain
3. Update DNS records (follow Vercel instructions)

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes & commit**
```bash
git add .
git commit -m "feat: describe your changes"
```

3. **Push & create PR**
```bash
git push origin feature/your-feature-name
```

4. **Code review & merge**

### Commit Convention
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Dependencies, build config

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Port 3000 already in use**
```bash
# Kill process using port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Issue: Database connection error**
```bash
# Check DATABASE_URL in .env.local
# Verify database is running
# Test connection: npx prisma db execute --stdin
```

**Issue: Cloudinary upload fails**
```bash
# Verify credentials
console.log(process.env.CLOUDINARY_CLOUD_NAME)

# Check CORS settings
# Check file size (< 100MB)
```

See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) untuk solusi lebih lengkap.

---

## 📊 Project Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Sprint 1-2: Foundation | 1-2 weeks | ⏳ Ready |
| Sprint 3-5: Auth & UI | 2 weeks | ⏳ Ready |
| Sprint 6-7: Owner Dashboard | 2 weeks | ⏳ Ready |
| Sprint 8-9: Penghuni Dashboard | 2 weeks | ⏳ Ready |
| Sprint 10-11: Checkout & Testing | 1-2 weeks | ⏳ Ready |
| Sprint 12: Deployment | 1 week | ⏳ Ready |
| **Total MVP** | **10-13 weeks** | **2-3 bulan** |

---

## 📈 Performance Targets

- **Lighthouse Score:** 90+
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3s
- **API Response Time:** < 500ms
- **Mobile Responsiveness:** 100%

---

## 🔒 Security Features

- ✅ HTTPS/TLS encryption
- ✅ Password hashing (bcryptjs)
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention (Prisma)
- ✅ Role-based access control
- ✅ Session management
- ✅ Secure file upload validation

---

## 📞 Support & Contact

### Get Help
- 📖 Read documentation files
- 🔍 Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for troubleshooting
- 💬 Visit [Next.js Discord](https://discord.gg/nextjs)
- 📧 Email: support@koskita.com

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🎉 Ready to Build?

1. **Start with** [TECHNICAL_PLANNING.md](./TECHNICAL_PLANNING.md) untuk memahami arsitektur
2. **Follow** [SPRINT_GUIDE.md](./SPRINT_GUIDE.md) untuk implementasi step-by-step
3. **Use** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) untuk tracking progress
4. **Reference** [API_REFERENCE.md](./API_REFERENCE.md) saat coding
5. **Consult** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) untuk tips & troubleshooting

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01-19 | Initial release |

---

**Made with ❤️ for modern property management**

**Last Updated:** November 19, 2025
