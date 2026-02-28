"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
            <Image src="/assets/cuenti.png" alt="Cuenti" width={18} height={18} />
          </div>
          <span className="text-base font-bold text-neutral-900">Cuenti</span>
        </div>
        {/* Spacer to center the logo */}
        <div className="w-9" />
      </header>

      {/* Main content */}
      <main className="md:ml-64 min-h-screen">
        <div className="pt-14 md:pt-0 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
