"use client";

import { Building2, ChevronDown } from "lucide-react";
import { Category } from "@/lib/types/category/types";

interface CategorySelectProps {
  selectedCategory: Category | undefined;
  categories: Category[];
  isLoading: boolean;
  showCategories: boolean;
  setShowCategories: (show: boolean) => void;
  onSelect: (id: number) => void;
  error?: string;
  fieldError?: string;
}

const CategorySelect = ({
  selectedCategory,
  categories,
  isLoading,
  showCategories,
  setShowCategories,
  onSelect,
  error,
  fieldError,
}: CategorySelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Categoría <span className="text-danger-500">*</span>
      </label>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          disabled={isLoading}
          className={`w-full pl-10 pr-10 py-2.5 rounded-xl border ${
            fieldError ? "border-danger-300" : "border-neutral-200"
          } bg-neutral-50 text-sm text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={selectedCategory ? "text-neutral-800" : "text-neutral-400"}>
            {isLoading
              ? "Cargando categorías..."
              : selectedCategory?.name || "Selecciona una categoría"}
          </span>
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showCategories ? "rotate-180" : ""}`} />

        {showCategories && !isLoading && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className="w-full px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 text-left cursor-pointer transition"
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-danger-500 mt-1">
            {error}
          </p>
        )}
      </div>
      {fieldError && (
        <p className="text-xs text-danger-500 mt-1">{fieldError}</p>
      )}
    </div>
  );
};

export default CategorySelect;
