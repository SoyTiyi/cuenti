"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import type { ServiceWithStats } from "@/lib/types/service/types";

type Filter = "all" | "with-sales" | "no-sales";

interface ServiceListProps {
  services: ServiceWithStats[];
  onServiceClick: (service: ServiceWithStats) => void;
}

export function ServiceList({ services, onServiceClick }: ServiceListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const bestSellerId = useMemo(() => {
    const best = services.reduce<ServiceWithStats | null>(
      (top, s) => (!top || s.salesCount > top.salesCount ? s : top),
      null
    );
    return best && best.salesCount > 0 ? best.id : null;
  }, [services]);

  const filtered = useMemo(() => {
    return services
      .filter((s) => {
        const q = search.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
        );
      })
      .filter((s) => {
        if (filter === "with-sales") return s.salesCount > 0;
        if (filter === "no-sales") return s.salesCount === 0;
        return true;
      });
  }, [services, search, filter]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "with-sales", label: "Con ventas" },
    { key: "no-sales", label: "Sin ventas" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
          />
        </div>
        <div className="flex gap-2">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                filter === key
                  ? "bg-primary-500 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-400 text-sm">
            {search || filter !== "all"
              ? "No hay servicios que coincidan con la búsqueda."
              : "No hay servicios registrados aún."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isBestSeller={service.id === bestSellerId}
              onClick={onServiceClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
