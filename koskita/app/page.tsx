'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, LayoutDashboard, ShieldCheck, Wallet, Zap } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rose-500/10 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">KOSKITA</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8 border border-indigo-100 dark:border-indigo-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform Manajemen Kos #1 di Indonesia
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Kelola Kos Jadi Lebih <br />
            <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Santuy & Efisien</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tinggalkan cara lama mencatat di buku. Beralih ke sistem digital yang mengurus tagihan, laporan, dan komplain secara otomatis.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-1">
                Mulai Gratis Sekarang <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900">
                Pelajari Fitur
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-5xl mb-32"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-2xl shadow-indigo-500/10">
            <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[16/9] flex items-center justify-center relative group">
              {/* Mock UI Elements */}
              <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-950/50 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500" />
              <div className="text-slate-400 font-medium flex flex-col items-center gap-4">
                <LayoutDashboard className="w-16 h-16 opacity-20" />
                <p>Dashboard Preview</p>
              </div>
              
              {/* Floating Cards Animation */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 left-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 w-48 z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">Pendapatan</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">Rp 15.500.000</div>
                <div className="text-[10px] text-green-500 flex items-center mt-1">
                  <Zap className="w-3 h-3 mr-1" /> +12% dari bulan lalu
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 w-48 z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-500">Status Kamar</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 w-[85%] h-full" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-slate-500">
                  <span>Terisi: 18</span>
                  <span>Kosong: 2</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: Wallet,
              title: "Tagihan Otomatis",
              desc: "Kirim tagihan ke penghuni secara otomatis setiap bulan via WhatsApp/Email.",
              color: "text-indigo-600",
              bg: "bg-indigo-50 dark:bg-indigo-900/20"
            },
            {
              icon: LayoutDashboard,
              title: "Dashboard Real-time",
              desc: "Pantau pendapatan, pengeluaran, dan status kamar dalam satu layar.",
              color: "text-rose-600",
              bg: "bg-rose-50 dark:bg-rose-900/20"
            },
            {
              icon: ShieldCheck,
              title: "Manajemen Penghuni",
              desc: "Data penghuni tersimpan aman, lengkap dengan foto KTP dan kontrak.",
              color: "text-emerald-600",
              bg: "bg-emerald-50 dark:bg-emerald-900/20"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Mengelola Kos dengan Lebih Profesional?</h2>
            <p className="text-indigo-100 mb-8 text-lg">Bergabung dengan ribuan pemilik kos lainnya yang sudah beralih ke Koskita.</p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none h-12 px-8 rounded-full font-bold shadow-xl">
                Daftar Gratis Sekarang
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white">KOSKITA</span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © 2024 Koskita. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Instagram</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
