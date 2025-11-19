# KOSKITA - Implementation Checklist

## 🚀 Pre-Development Setup

### Environment & Tools
- [ ] Node.js 18+ installed
- [ ] PostgreSQL/MySQL database running
- [ ] Cloudinary account created (free tier ok)
- [ ] GitHub repository created & cloned
- [ ] VS Code with extensions installed (Prettier, ESLint, Tailwind CSS)

### Accounts Needed
- [ ] Cloudinary (cloud name, API key, secret)
- [ ] Vercel (untuk deployment preview)
- [ ] Railway atau managed database service

### Required Credentials
```env
✓ DATABASE_URL
✓ NEXTAUTH_SECRET
✓ NEXTAUTH_URL
✓ CLOUDINARY_CLOUD_NAME
✓ CLOUDINARY_API_KEY
✓ CLOUDINARY_API_SECRET
```

---

## 📦 SPRINT 1: Project Foundation

### Dependencies Installation
- [ ] `npm install framer-motion`
- [ ] `npm install next-auth@5.0.0-beta`
- [ ] `npm install @prisma/client prisma`
- [ ] `npm install next-cloudinary`
- [ ] `npm install react-hook-form zod`
- [ ] `npm install axios`
- [ ] `npm install bcryptjs`
- [ ] `npm install -D @types/bcryptjs`

### Shadcn/UI Components
- [ ] `npx shadcn-ui@latest init -d`
- [ ] `npx shadcn-ui@latest add button`
- [ ] `npx shadcn-ui@latest add input`
- [ ] `npx shadcn-ui@latest add card`
- [ ] `npx shadcn-ui@latest add dialog`
- [ ] `npx shadcn-ui@latest add badge`
- [ ] `npx shadcn-ui@latest add toast`
- [ ] `npx shadcn-ui@latest add form`
- [ ] `npx shadcn-ui@latest add select`
- [ ] `npx shadcn-ui@latest add textarea`

### Folder Structure
- [ ] Create `app/(auth)/login` folder
- [ ] Create `app/(owner)/{dashboard,penghuni,kamar,keuangan,laporan}` folders
- [ ] Create `app/(penghuni)/{dashboard,pembayaran,pengaduan,akun}` folders
- [ ] Create `app/api/{auth,owner,penghuni,upload}` folders
- [ ] Create `components/{ui,auth,owner,penghuni,shared}` folders
- [ ] Create `lib` folder
- [ ] Create `prisma` folder

### Configuration Files
- [ ] Update `tailwind.config.ts` with Gen Z colors
- [ ] Update `tsconfig.json` if needed
- [ ] Create `.env.local` with template variables
- [ ] Create `.gitignore`

### Version Control
- [ ] `git init`
- [ ] `git add .`
- [ ] `git commit -m "Initial project setup"`
- [ ] Create GitHub repository
- [ ] `git remote add origin <repo-url>`
- [ ] `git push -u origin main`

---

## 🗄️ SPRINT 2: Database Design

### Prisma Setup
- [ ] `npx prisma init`
- [ ] Create `prisma/schema.prisma` with complete schema
- [ ] Configure DATABASE_URL in `.env.local`
- [ ] `npx prisma migrate dev --name init`

### Schema Implementation
- [ ] Create User model
- [ ] Create Owner model
- [ ] Create Kamar model
- [ ] Create Penghuni model
- [ ] Create KontrakSewa model
- [ ] Create Pembayaran model
- [ ] Create Pengaduan model
- [ ] Create CheckoutRequest model
- [ ] Create Notifikasi model
- [ ] Create RiwayatKamar model

### Data Seeding (Optional)
- [ ] Create `prisma/seed.ts`
- [ ] Add seed script to `package.json`: `"prisma": "prisma"`
- [ ] `npx prisma db seed`

### Schema Verification
- [ ] `npx prisma studio` dan verify structure
- [ ] Check all relationships
- [ ] Verify indexes
- [ ] Verify unique constraints

### Prisma Client Setup
- [ ] Create `lib/prisma.ts` with singleton pattern
- [ ] Verify Prisma client can connect
- [ ] Test query dengan simple script

---

## 🔐 SPRINT 3: Authentication & Login

### Auth Configuration
- [ ] Create `auth.ts` dengan NextAuth config
- [ ] Setup Credentials provider
- [ ] Implement password hashing (bcryptjs)
- [ ] Create authorization callbacks
- [ ] Setup JWT & session handling

### Login Page
- [ ] Create `app/(auth)/login/page.tsx`
- [ ] Implement Gen Z UI design
- [ ] Add float label inputs
- [ ] Add error message handling
- [ ] Add loading state
- [ ] Add demo credentials display

### Middleware
- [ ] Create `middleware.ts` untuk route protection
- [ ] Implement role-based routing
- [ ] Test redirect logic

### Auth API Routes
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] Verify login endpoint works
- [ ] Verify session endpoint
- [ ] Verify logout works

### Testing
- [ ] Login dengan valid credentials
- [ ] Login dengan invalid credentials
- [ ] Verify owner redirects ke `/owner/dashboard`
- [ ] Verify penghuni redirects ke `/penghuni/dashboard`
- [ ] Test unauthorized access blocking
- [ ] Test logout functionality
- [ ] Test inactive account blocking

---

## 🎨 SPRINT 4-5: UI Design System & Components

### Custom Components - Input
- [ ] Create `FloatLabelInput` component
- [ ] Test float label animation
- [ ] Add validation styling
- [ ] Add focus/blur states

### Custom Components - Display
- [ ] Create `StatusBadge` component (Kosong/Terisi/Akan Kosong)
- [ ] Create `RoomCard` component
- [ ] Create `PaymentProgressBar` component
- [ ] Create `ComplaintCard` component
- [ ] Create `NotificationCard` component

### Layout Components
- [ ] Create `OwnerLayout` component (sidebar + topbar)
- [ ] Create `PenghuniLayout` component (mobile-friendly)
- [ ] Create `Sidebar` component
- [ ] Create `TopBar` component
- [ ] Create `Navigation` component

### Animations & Transitions
- [ ] Setup Framer Motion page transitions
- [ ] Create card entrance animations
- [ ] Create status change animations
- [ ] Create loading skeleton animations
- [ ] Create toast/notification animations

### Theme Configuration
- [ ] Configure Tailwind colors (Gen Z palette)
- [ ] Setup dark mode support (optional)
- [ ] Configure responsive breakpoints
- [ ] Setup reusable spacing/sizing

### Component Library Testing
- [ ] Storybook setup (optional)
- [ ] Component visual testing
- [ ] Responsive testing di berbagai screen sizes

---

## 👥 SPRINT 6: Owner Dashboard - Part 1 (Penghuni & Kamar)

### Penghuni Management Feature
- [ ] Create `app/(owner)/penghuni/page.tsx` (list view)
- [ ] Create penghuni list with search/filter
- [ ] Create add penghuni modal/form
- [ ] Create edit penghuni form
- [ ] Create delete penghuni (soft delete)
- [ ] Implement pagination

### KTP Upload Feature
- [ ] Create upload KTP modal
- [ ] Implement drag-drop zone
- [ ] Add image preview
- [ ] Setup Cloudinary integration
- [ ] Create KTP storage in database
- [ ] Add KTP view/download

### API Routes untuk Penghuni
- [ ] `GET /api/owner/penghuni`
- [ ] `POST /api/owner/penghuni`
- [ ] `PATCH /api/owner/penghuni/:id`
- [ ] `POST /api/upload/ktp`
- [ ] Test semua endpoints

### Kamar Management Feature
- [ ] Create `app/(owner)/kamar/page.tsx`
- [ ] Create kamar grid/list view
- [ ] Implement status color-coding
- [ ] Create add kamar form
- [ ] Create edit kamar & tarif form
- [ ] Create fasilitas editor

### API Routes untuk Kamar
- [ ] `GET /api/owner/kamar`
- [ ] `POST /api/owner/kamar`
- [ ] `PATCH /api/owner/kamar/:id`
- [ ] Implement pagination/filtering
- [ ] Test semua endpoints

### Owner Dashboard Main
- [ ] Create `app/(owner)/dashboard/page.tsx`
- [ ] Show kamar grid with status
- [ ] Show quick stats (total penghuni, etc)
- [ ] Show upcoming contract endings
- [ ] Responsive design

---

## 💰 SPRINT 7: Owner Dashboard - Part 2 (Keuangan & Komunikasi)

### Pembayaran Management
- [ ] Create `app/(owner)/keuangan/pembayaran/page.tsx`
- [ ] Create payment list with filtering
- [ ] Create payment status view
- [ ] Implement manual payment recording
- [ ] Implement payment verification
- [ ] Create payment detail view

### API Routes untuk Pembayaran
- [ ] `GET /api/owner/pembayaran`
- [ ] `PATCH /api/owner/pembayaran/:id` (verify)
- [ ] `POST /api/owner/pembayaran/manual`
- [ ] Test semua endpoints

### Laporan Keuangan
- [ ] Create `app/(owner)/laporan/page.tsx`
- [ ] Implement income report
- [ ] Implement debt tracking
- [ ] Create export PDF functionality
- [ ] Create monthly/yearly reports

### API Routes untuk Laporan
- [ ] `GET /api/owner/laporan/keuangan`
- [ ] `GET /api/owner/laporan/piutang`
- [ ] `GET /api/owner/laporan/export`

### Pengaduan Management
- [ ] Create `app/(owner)/pengaduan/page.tsx`
- [ ] Create complaint list with status filtering
- [ ] Create complaint detail view
- [ ] Implement status update form
- [ ] Add complaint tracking

### API Routes untuk Pengaduan
- [ ] `GET /api/owner/pengaduan`
- [ ] `PATCH /api/owner/pengaduan/:id`

### Broadcast Notifications
- [ ] Create notification broadcast feature
- [ ] Create broadcast form
- [ ] Implement to penghuni
- [ ] Create notification log view

### API Routes untuk Notifikasi
- [ ] `POST /api/owner/notifikasi/broadcast`
- [ ] `GET /api/owner/notifikasi/log`

---

## 🏠 SPRINT 8-9: Penghuni Dashboard

### Dashboard Landing Page
- [ ] Create `app/(penghuni)/dashboard/page.tsx`
- [ ] Show rental information snapshot
- [ ] Show room number, type, price
- [ ] Implement progress bar (sisa hari sewa)
- [ ] Show due date with visual warning
- [ ] Mobile-first design

### Payment Center
- [ ] Create `app/(penghuni)/pembayaran/page.tsx`
- [ ] Create upload bukti transfer feature
- [ ] Implement drag-drop upload
- [ ] Show payment history
- [ ] Show due dates with color warning
- [ ] Add receipt/verification status

### API Routes untuk Penghuni - Pembayaran
- [ ] `GET /api/penghuni/pembayaran`
- [ ] `POST /api/penghuni/pembayaran/upload`
- [ ] `POST /api/upload/bukti-transfer`

### Complaint Feature
- [ ] Create `app/(penghuni)/pengaduan/page.tsx`
- [ ] Create complaint form
- [ ] Show complaint history
- [ ] Show complaint status tracking
- [ ] Allow photo upload for complaint

### API Routes untuk Pengaduan
- [ ] `GET /api/penghuni/pengaduan`
- [ ] `POST /api/penghuni/pengaduan`
- [ ] `POST /api/upload/pengaduan` (foto)

### Account Settings
- [ ] Create `app/(penghuni)/akun/page.tsx`
- [ ] Create profile edit form
- [ ] Implement password change
- [ ] Show contract document
- [ ] Show house rules

### API Routes untuk Akun
- [ ] `GET /api/penghuni/akun`
- [ ] `PATCH /api/penghuni/akun`
- [ ] `POST /api/penghuni/akun/ganti-password`
- [ ] `GET /api/penghuni/kontrak`
- [ ] `GET /api/penghuni/peraturan`

### Notifications
- [ ] Create notification inbox
- [ ] Show all notifications
- [ ] Implement mark as read
- [ ] Show notification type badge

### API Routes untuk Notifikasi
- [ ] `GET /api/penghuni/notifikasi`
- [ ] `PATCH /api/penghuni/notifikasi/:id/read`

### Check-out Request
- [ ] Create check-out request form
- [ ] Show check-out status
- [ ] Allow viewing check-out requirements
- [ ] Implement payment verification

### API Routes untuk Check-out
- [ ] `POST /api/penghuni/checkout-request`
- [ ] `GET /api/penghuni/checkout-request`

---

## 📤 SPRINT 9: File Upload & Cloudinary Integration

### Cloudinary Setup
- [ ] Create Cloudinary account
- [ ] Get cloud name, API key, API secret
- [ ] Add credentials to `.env.local`
- [ ] Create `lib/cloudinary.ts`

### Upload Implementations
- [ ] Implement KTP upload function
- [ ] Implement bukti transfer upload
- [ ] Implement complaint photo upload
- [ ] Add file size validation (< 5MB)
- [ ] Add file type validation

### Secure Upload Endpoints
- [ ] Create `/api/upload/ktp` endpoint
- [ ] Create `/api/upload/bukti-transfer` endpoint
- [ ] Create `/api/upload/pengaduan` endpoint
- [ ] Add authentication checks
- [ ] Add rate limiting

### File Management
- [ ] Implement file preview
- [ ] Implement file deletion (cleanup in Cloudinary)
- [ ] Add upload progress tracking
- [ ] Add error handling

---

## ♻️ SPRINT 10: Checkout & Automation

### Check-out Request Flow
- [ ] Create `app/(owner)/checkout/page.tsx`
- [ ] Create checkout list view
- [ ] Show pending checkouts
- [ ] Show payment verification status
- [ ] Implement finalize button

### API Routes untuk Check-out
- [ ] `GET /api/owner/checkout-request`
- [ ] `PATCH /api/owner/checkout-request/:id/finalize`

### Checkout Automation Logic
- [ ] Implement database transaction
- [ ] Verify all payments settled
- [ ] Update room status to KOSONG
- [ ] Archive tenant data
- [ ] Deactivate user account
- [ ] Create audit log
- [ ] Send confirmation notification

### Data Archiving
- [ ] Implement soft delete dengan archivedAt
- [ ] Create archive view (optional)
- [ ] Implement data retention policy
- [ ] Test archive restoration (if needed)

### Testing Check-out Flow
- [ ] Test full check-out flow
- [ ] Test payment verification
- [ ] Verify data archiving
- [ ] Verify room status change
- [ ] Verify user deactivation

---

## 🧪 SPRINT 11: Testing & Quality Assurance

### Unit Tests
- [ ] Setup Jest + React Testing Library
- [ ] Test `FloatLabelInput` component
- [ ] Test `StatusBadge` component
- [ ] Test validation functions
- [ ] Test utility functions

### Integration Tests
- [ ] Test login flow
- [ ] Test create penghuni flow
- [ ] Test upload KTP flow
- [ ] Test payment verification flow
- [ ] Test check-out flow

### E2E Tests (Optional)
- [ ] Setup Playwright atau Cypress
- [ ] Test complete user journeys
- [ ] Test owner workflows
- [ ] Test penghuni workflows

### Performance Testing
- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Optimize fonts
- [ ] Enable caching

### Responsive Design Testing
- [ ] Test on mobile (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] Test touch interactions
- [ ] Test form accessibility

### Security Testing
- [ ] Test authentication bypass attempts
- [ ] Test XSS prevention
- [ ] Test CSRF protection
- [ ] Test SQL injection prevention
- [ ] Check sensitive data exposure

### Browser Testing
- [ ] Test Chrome/Edge (Chromium)
- [ ] Test Firefox
- [ ] Test Safari
- [ ] Test mobile browsers

---

## 🚀 SPRINT 12: Deployment & Documentation

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] No security vulnerabilities (npm audit)
- [ ] Environment variables documented
- [ ] Database migrations tested

### Deployment Setup
- [ ] Create Vercel project
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Setup database (Vercel Postgres atau Railway)
- [ ] Configure custom domain (optional)

### Production Deployment
- [ ] Deploy to Vercel
- [ ] Run Lighthouse audit on production
- [ ] Verify all features work
- [ ] Test on production database
- [ ] Monitor error logs

### Documentation
- [ ] Create `README.md` dengan setup instructions
- [ ] Document API endpoints (OpenAPI/Swagger)
- [ ] Create user guide untuk Owner
- [ ] Create user guide untuk Penghuni
- [ ] Create deployment guide
- [ ] Create troubleshooting guide
- [ ] Document environment variables

### Post-Launch
- [ ] Monitor server errors
- [ ] Monitor performance metrics
- [ ] Collect user feedback
- [ ] Plan for Phase 2 features
- [ ] Setup automated backups

---

## 🎯 Optional Enhancements (Phase 2)

### Payment Gateway Integration
- [ ] Implement Midtrans integration
- [ ] Setup virtual account generation
- [ ] Implement webhook handling
- [ ] Auto-verify payments from VA

### SMS/WhatsApp Notifications
- [ ] Integrate Twilio atau WhatsApp API
- [ ] Send payment reminders
- [ ] Send complaint status updates
- [ ] Send contract ending notifications

### Email Notifications
- [ ] Setup email service (SendGrid, Postmark)
- [ ] Send payment reminders
- [ ] Send welcome emails
- [ ] Send documents via email

### Analytics & Reporting
- [ ] Implement occupancy rate tracking
- [ ] Revenue analytics
- [ ] Payment trend analysis
- [ ] Tenant churn analysis

### Advanced Features
- [ ] Maintenance scheduling
- [ ] Expense tracking
- [ ] Tenant referral system
- [ ] Review/rating system

---

## ✅ Final Verification Checklist

Before launching:
- [ ] All core features implemented
- [ ] All APIs tested
- [ ] All forms validated
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Documentation complete
- [ ] Users trained
- [ ] Backup system ready
- [ ] Monitoring setup

---

**Project Status:** Ready to Start Development ✅

**Estimated Timeline:**
- Sprint 1-2: 1-2 minggu (Foundation & DB)
- Sprint 3-5: 2 minggu (Auth & UI)
- Sprint 6-7: 2 minggu (Owner Dashboard)
- Sprint 8-9: 2 minggu (Penghuni Dashboard)
- Sprint 10-11: 1-2 minggu (Checkout & Testing)
- Sprint 12: 1 minggu (Deployment)

**Total: 10-13 minggu (2-3 bulan) untuk MVP**

---

Last Updated: November 19, 2025
