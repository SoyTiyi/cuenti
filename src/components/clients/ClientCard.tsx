"use client";

import { Phone, Mail, TrendingUp, AlertCircle } from "lucide-react";
import { ClientAvatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import type { ClientWithStats } from "@/lib/types/client/types";

interface ClientCardProps {
  client: ClientWithStats;
  onClick: (client: ClientWithStats) => void;
}

export function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <div
      onClick={() => onClick(client)}
      className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <ClientAvatar name={client.name} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 truncate">{client.name}</p>
            <p className="text-xs text-neutral-400">
              {client.visitCount} {client.visitCount === 1 ? "visita" : "visitas"}
            </p>
          </div>
        </div>
        {client.pendingAmount > 0 && (
          <span className="flex items-center gap-1 px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium flex-shrink-0">
            <AlertCircle size={11} />
            Deuda
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Phone size={13} className="flex-shrink-0" />
            <span className="truncate">{client.phone}</span>
          </div>
        )}
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Mail size={13} className="flex-shrink-0" />
            <span className="truncate">{client.email}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-wide">Total gastado</p>
          <p className="text-sm font-bold text-neutral-900 mt-0.5">{formatCurrency(client.totalSpent)}</p>
        </div>
        {client.pendingAmount > 0 ? (
          <div>
            <p className="text-xs text-warning-500 uppercase tracking-wide">Por cobrar</p>
            <p className="text-sm font-bold text-warning-600 mt-0.5">{formatCurrency(client.pendingAmount)}</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-neutral-400 uppercase tracking-wide">Última visita</p>
            <p className="text-sm font-medium text-neutral-600 mt-0.5">
              {client.lastVisit ? formatDate(client.lastVisit) : "—"}
            </p>
          </div>
        )}
      </div>

      {client.totalSpent > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-success-600 font-medium">
          <TrendingUp size={13} />
          Cliente activa
        </div>
      )}
    </div>
  );
}
