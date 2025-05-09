"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="font-bold text-xl">LOGO</div>
        <div className="flex items-center gap-2">
          <div className="text-center">
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <p className="text-sm hidden sm:inline">Selamat Datang</p>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium cursor-pointer">
              Nama Pengguna
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white cursor-pointer" align="end">
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="mt-4 border-b border-gray-200"></div>
    </header>
  )
} 