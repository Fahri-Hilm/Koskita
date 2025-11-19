'use client'

import { useState } from 'react'
import { OwnerLayout } from '@/components/layout/owner-layout'
import { Button } from '@/components/ui/button'
import { Plus, Search, MoreVertical, FileText, Trash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from '@/components/shared/status-badge'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PenghuniPage() {
  // Dummy data
  const tenants = [
    {
      id: 1,
      name: 'Budi Santoso',
      room: '101',
      phone: '081234567890',
      status: 'AKTIF',
      joinDate: '12 Jan 2024',
      paymentStatus: 'LUNAS'
    },
    {
      id: 2,
      name: 'Siti Aminah',
      room: '104',
      phone: '081987654321',
      status: 'AKTIF',
      joinDate: '15 Feb 2024',
      paymentStatus: 'PENDING'
    },
    {
      id: 3,
      name: 'Rudi Hermawan',
      room: '-',
      phone: '081223344556',
      status: 'NON_AKTIF',
      joinDate: '10 Dec 2023',
      paymentStatus: 'LUNAS'
    },
  ]

  return (
    <OwnerLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Daftar Penghuni</h1>
            <p className="text-slate-500 mt-2">Kelola data penghuni dan status sewa</p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Plus className="w-4 h-4" /> Tambah Penghuni
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Cari nama atau nomor kamar..." 
                className="pl-9 border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Nama Penghuni</TableHead>
                <TableHead>Kamar</TableHead>
                <TableHead>No. Telepon</TableHead>
                <TableHead>Tanggal Masuk</TableHead>
                <TableHead>Status Sewa</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 bg-indigo-100 text-indigo-600">
                        <AvatarFallback>{tenant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-slate-900">{tenant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                      {tenant.room}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">{tenant.phone}</TableCell>
                  <TableCell className="text-slate-500">{tenant.joinDate}</TableCell>
                  <TableCell>
                    <StatusBadge status={tenant.status as any} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tenant.paymentStatus as any} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="w-4 h-4 mr-2" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </OwnerLayout>
  )
}