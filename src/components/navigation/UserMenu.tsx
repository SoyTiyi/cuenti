"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LogOut, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const displayName = user.name || user.email?.split("@")[0] || "Usuario";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 transition-all duration-200"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center flex-shrink-0">
          {user.picture ? (
            <Image
              src={user.picture}
              alt={displayName}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-primary-600 font-semibold text-sm">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-neutral-900 truncate">{displayName}</p>
          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
        </div>
        <ChevronUp
          size={16}
          className={`text-neutral-400 transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
          <a
            href="/auth/logout"
            className="flex items-center gap-3 px-4 py-3 text-sm text-danger-600 hover:bg-danger-50 transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </a>
        </div>
      )}
    </div>
  );
}
