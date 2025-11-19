import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <main className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-600 sm:text-6xl">
            KOSKITA
          </h1>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Sistem Manajemen Kos Modern. Kelola kos Anda dengan mudah, aman, dan efisien.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              Masuk ke Aplikasi
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
