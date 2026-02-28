import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface SelectDropdownProps {
  label: string;
  required?: boolean;
  displayValue: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: ReactNode;
  children: ReactNode;
}

/**
 * Reusable inline dropdown selector.
 * Expands in-place (accordion) — no absolute positioning, nothing gets hidden.
 * Pass your list + optional "create new" footer as children.
 */
export function SelectDropdown({
  label,
  required,
  displayValue,
  isOpen,
  onToggle,
  icon,
  children,
}: SelectDropdownProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          {icon}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition cursor-pointer"
        >
          {displayValue}
        </button>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="mt-1 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
