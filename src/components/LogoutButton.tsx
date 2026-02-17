"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <a
      href="/auth/logout"
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
    >
      <LogOut size={18} />
      <span>Cerrar sesión</span>
    </a>
  );
}