"use client";

import Image from "next/image";
import { LayoutDashboard, ShoppingCart, Package, Users, TrendingDown, X } from "lucide-react";
import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/ventas",
    icon: ShoppingCart,
    label: "Ventas",
  },
  {
    href: "/servicios",
    icon: Package,
    label: "Servicios",
  },
  {
    href: "/clientes",
    icon: Users,
    label: "Clientes",
  },
  {
    href: "/gastos",
    icon: TrendingDown,
    label: "Gastos",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-neutral-900/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-neutral-200 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <Image src="/assets/cuenti.png" alt="Cuenti" width={28} height={28} />
            </div>
            <span className="text-xl font-bold text-neutral-900">Cuenti</span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <UserMenu />
        </div>
      </aside>
    </>
  );
}
