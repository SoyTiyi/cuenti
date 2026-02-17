"use client";

import Image from "next/image";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
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
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r border-neutral-200 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <Image
              src="/assets/cuenti.png"
              alt="Cuenti"
              width={28}
              height={28}
            />
          </div>
          <span className="text-xl font-bold text-neutral-900">Cuenti</span>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <UserMenu />
      </div>
    </aside>
  );
}
