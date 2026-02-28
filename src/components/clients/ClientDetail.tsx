"use client";

import { X, Phone, Mail, Package, AlertCircle, Check } from "lucide-react";
import { ClientAvatar } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { ClientWithStats } from "@/lib/types/client/types";

interface ClientDetailProps {
  client: ClientWithStats | null;
  onClose: () => void;
}

export function ClientDetail({ client, onClose }: ClientDetailProps) {
  useScrollLock(!!client);
  if (!client) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClientAvatar name={client.name} size="md" />
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{client.name}</h2>
              <p className="text-sm text-neutral-500">
                {client.visitCount} {client.visitCount === 1 ? "visita" : "visitas"} ·{" "}
                Cliente desde {formatDate(client.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Contact */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Contacto</h3>
            {client.phone && (
              <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors">
                <Phone size={15} className="text-neutral-400" />
                {client.phone}
              </a>
            )}
            {client.email && (
              <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary-600 transition-colors">
                <Mail size={15} className="text-neutral-400" />
                {client.email}
              </a>
            )}
            {!client.phone && !client.email && (
              <p className="text-sm text-neutral-400">Sin datos de contacto</p>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Total gastado</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">{formatCurrency(client.totalSpent)}</p>
            </div>
            <div className={`rounded-xl p-4 ${client.pendingAmount > 0 ? "bg-warning-50" : "bg-success-50"}`}>
              <p className={`text-xs uppercase tracking-wide ${client.pendingAmount > 0 ? "text-warning-500" : "text-success-500"}`}>
                {client.pendingAmount > 0 ? "Por cobrar" : "Al día"}
              </p>
              <p className={`text-xl font-bold mt-1 ${client.pendingAmount > 0 ? "text-warning-700" : "text-success-700"}`}>
                {client.pendingAmount > 0 ? formatCurrency(client.pendingAmount) : "✓"}
              </p>
            </div>
          </div>

          {/* Sale history */}
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-3">
              Historial de servicios
            </h3>
            {client.sales.length === 0 ? (
              <p className="text-sm text-neutral-400">Sin servicios registrados</p>
            ) : (
              <div className="space-y-2">
                {client.sales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg ${sale.isPaid ? "bg-success-100" : "bg-warning-100"}`}>
                        {sale.isPaid
                          ? <Check size={13} className="text-success-600" />
                          : <AlertCircle size={13} className="text-warning-600" />
                        }
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <Package size={12} className="text-neutral-400 flex-shrink-0" />
                          <p className="text-sm font-medium text-neutral-800 truncate">{sale.service.name}</p>
                        </div>
                        <p className="text-xs text-neutral-400">{formatDate(sale.saleDate)}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold flex-shrink-0 ml-2 ${sale.isPaid ? "text-neutral-900" : "text-warning-600"}`}>
                      {formatCurrency(Number(sale.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
