"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

export default function NavItem({ href, icon: Icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive
          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        }
      `}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}
