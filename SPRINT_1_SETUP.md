# 🚀 SPRINT 1 - Project Initial Setup & Dependencies

## ✅ GitHub Push Success! 

```
Repository: https://github.com/Fahri-Hilm/Koskita ✅
Branch: main ✅
Commits: 1 ✅
Files: 14 documentation files ✅
Status: READY FOR DEVELOPMENT ✅
```

---

## 📋 SPRINT 1 Checklist

**Duration:** Week 1-2  
**Goal:** Setup Next.js project structure with all dependencies installed

### Tasks:
- [ ] Create Next.js project
- [ ] Install dependencies (15+ packages)
- [ ] Setup folder structure
- [ ] Configure Tailwind CSS
- [ ] Setup environment variables
- [ ] Verify development server works

---

## 🏗️ STEP 1: Create Next.js Project

Choose one option below:

### Option A: Using Create-Next-App (Recommended for beginners)

```bash
# Go to parent directory
cd /home/fj/Desktop/PROJECT

# Create new Next.js project
npx create-next-app@latest koskita --typescript --tailwind --eslint --app

# When prompted, select:
# ✔ TypeScript: Yes
# ✔ Tailwind CSS: Yes
# ✔ ESLint: Yes
# ✔ Use src/ directory: No
# ✔ App Router: Yes
# ✔ Turbopack: No

# Navigate to project
cd koskita
```

### Option B: Clone Starter Kit

```bash
cd /home/fj/Desktop/PROJECT

# Clone the starter kit
git clone https://github.com/Kiranism/next-shadcn-dashboard-starter koskita

# Navigate to project
cd koskita

# Install dependencies
npm install
```

---

## 📦 STEP 2: Install All Required Dependencies

```bash
cd /home/fj/Desktop/PROJECT/koskita

# Core dependencies
npm install framer-motion
npm install next-auth@5.0.0-beta
npm install @prisma/client prisma
npm install next-cloudinary
npm install react-hook-form zod
npm install axios
npm install bcryptjs

# Dev dependencies
npm install -D @types/bcryptjs

# If using create-next-app, also install Shadcn UI:
npx shadcn-ui@latest init -d
```

### Verify Installation

```bash
npm list | head -30
```

You should see all packages installed.

---

## 🎨 STEP 3: Setup Shadcn/UI Components

```bash
cd /home/fj/Desktop/PROJECT/koskita

# Initialize Shadcn/UI
npx shadcn-ui@latest init -d

# Add frequently used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add dropdown-menu
```

---

## 📁 STEP 4: Create Folder Structure

```bash
cd /home/fj/Desktop/PROJECT/koskita

# Create all necessary folders
mkdir -p app/{auth,owner,penghuni,api}
mkdir -p "app/(auth)/login"
mkdir -p "app/(owner)/{dashboard,penghuni,kamar,keuangan/{pembayaran,laporan},pengaduan,checkout}"
mkdir -p "app/(penghuni)/{dashboard,pembayaran,pengaduan,akun}"
mkdir -p "app/api/auth/[...nextauth]"
mkdir -p "app/api/owner/{penghuni,kamar,pembayaran,pengaduan,laporan,checkout}"
mkdir -p "app/api/penghuni/{dashboard,pembayaran,pengaduan,akun,checkout-request}"
mkdir -p "app/api/upload/{ktp,bukti-transfer,pengaduan}"
mkdir -p components/{ui,auth,owner,penghuni,shared,layout}
mkdir -p lib
mkdir -p prisma
mkdir -p public/images

echo "✅ Folder structure created successfully!"
```

---

## ⚙️ STEP 5: Configure Tailwind CSS (Gen Z Colors)

**Update `tailwind.config.ts`:**

```typescript
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
```

---

## 📝 STEP 6: Setup Environment Variables

**Create `.env.local` file:**

```bash
cd /home/fj/Desktop/PROJECT/koskita

cat > .env.local << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/koskita_dev"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Optional - Payment Gateway (Phase 2)
# MIDTRANS_SERVER_KEY="..."
# MIDTRANS_CLIENT_KEY="..."
EOF
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -hex 32
```

Copy output dan replace di `.env.local`

---

## 🔧 STEP 7: Initialize Git Repository

```bash
cd /home/fj/Desktop/PROJECT/koskita

# Initialize git
git init

# Configure user
git config user.name "KOSKITA Developer"
git config user.email "dev@koskita.local"

# Add all files
git add .

# Create initial commit
git commit -m "feat: Initialize Next.js project with Shadcn/UI and folder structure"

# Add remote (connect to GitHub)
git remote add origin https://github.com/Fahri-Hilm/Koskita-App.git

# Push to GitHub
git branch -m master main
git push -u origin main
```

---

## ✅ STEP 8: Verify Development Server

```bash
cd /home/fj/Desktop/PROJECT/koskita

# Start development server
npm run dev
```

**Expected output:**
```
> koskita@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000

✓ Ready in 2.5s
```

**Visit:** http://localhost:3000

You should see the default Next.js welcome page.

---

## 📊 SPRINT 1 Verification Checklist

- [ ] Next.js project created
- [ ] All dependencies installed (npm list shows packages)
- [ ] Shadcn/UI components added
- [ ] Folder structure created (verify with: `find app -type d`)
- [ ] Tailwind CSS configured
- [ ] `.env.local` file created with variables
- [ ] Git repository initialized
- [ ] GitHub remote added
- [ ] Initial commit pushed to GitHub
- [ ] Development server starts without errors
- [ ] Can visit http://localhost:3000

---

## 🎯 Next Steps After Sprint 1

Once Sprint 1 is complete:
1. Move to **Sprint 2: Database Design** (prisma/schema.prisma)
2. Setup PostgreSQL database
3. Create database migrations
4. Test database connections

---

## 💡 Troubleshooting

### Issue: npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: Shadcn/UI init fails
```bash
# Make sure you're in the project directory
cd /home/fj/Desktop/PROJECT/koskita

# Try again
npx shadcn-ui@latest init -d
```

### Issue: Git push fails
```bash
# Check remote
git remote -v

# Make sure you created the GitHub repo first!
# Go to https://github.com/new and create "Koskita-App" repository
```

---

## 📚 Reference Files

For more details, see:
- `TECHNICAL_PLANNING.md` - Architecture overview
- `SPRINT_GUIDE.md` - Detailed sprint instructions
- `FILE_STRUCTURE_TEMPLATE.md` - Code templates
- `QUICK_REFERENCE.md` - Quick tips & troubleshooting

---

## 🎊 SPRINT 1 COMPLETE When:

✅ Next.js project setup  
✅ Dependencies installed  
✅ Folder structure created  
✅ Environment variables configured  
✅ Development server running  
✅ Code pushed to GitHub  

---

**Estimated Duration:** 1-2 weeks  
**Status:** Ready to start  
**Next:** Sprint 2 - Database Setup  

Let me know when Sprint 1 is complete! 🚀
