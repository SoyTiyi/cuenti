"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { ClientCard } from "./ClientCard";
import type { ClientWithStats } from "@/lib/types/client/types";

type Filter = "all" | "debt" | "active";

interface ClientListProps {
  clients: ClientWithStats[];
  onClientClick: (client: ClientWithStats) => void;
}

export function ClientList({ clients, onClientClick }: ClientListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return clients
      .filter((c) => {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (filter === "debt") return c.pendingAmount > 0;
        if (filter === "active") return c.lastVisit && new Date(c.lastVisit) >= startOfMonth;
        return true;
      });
  }, [clients, search, filter]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "Todas" },
    { key: "active", label: "Activas este mes" },
    { key: "debt", label: "Con deuda" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o correo..."
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
              ? "No hay clientes que coincidan con la búsqueda."
              : "No hay clientes registradas aún."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} onClick={onClientClick} />
          ))}
        </div>
      )}
    </div>
  );
}
