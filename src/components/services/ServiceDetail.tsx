"use client";

import { useState } from "react";
import { X, Package, DollarSign, Calendar, ShoppingCart, Pencil, Trash2, Loader2 } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { ServiceWithStats } from "@/lib/types/service/types";

interface ServiceDetailProps {
  service: ServiceWithStats | null;
  onClose: () => void;
  onEdit: (service: ServiceWithStats) => void;
  onDelete: (id: number) => Promise<void>;
}

export function ServiceDetail({ service, onClose, onEdit, onDelete }: ServiceDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useScrollLock(!!service);
  if (!service) return null;

  const canDelete = service.salesCount === 0;

  const handleDelete = async () => {
    if (!canDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(service.id);
      onClose();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setIsDeleting(false);
    }
  };

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
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-primary-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{service.name}</h2>
              <p className="text-sm text-neutral-500">
                Creado {formatDate(service.createdAt)}
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
          {/* Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Información</h3>

            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <DollarSign size={15} className="text-neutral-400" />
              <span>Precio: <strong>{formatCurrency(Number(service.price))}</strong></span>
            </div>

            {service.description && (
              <p className="text-sm text-neutral-600">{service.description}</p>
            )}

            {service.lastSaleDate && (
              <div className="flex items-center gap-2 text-sm text-neutral-700">
                <Calendar size={15} className="text-neutral-400" />
                <span>Última venta: {formatDate(service.lastSaleDate)}</span>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-neutral-50 rounded-xl p-4">
              <p className="text-xs text-neutral-400 uppercase tracking-wide">Ventas totales</p>
              <p className="text-xl font-bold text-neutral-900 mt-1">{service.salesCount}</p>
            </div>
            <div className="bg-success-50 rounded-xl p-4">
              <p className="text-xs text-success-500 uppercase tracking-wide">Ingresos</p>
              <p className="text-xl font-bold text-success-700 mt-1">
                {formatCurrency(service.totalRevenue)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Acciones</h3>

            <button
              onClick={() => onEdit(service)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors text-sm cursor-pointer"
            >
              <Pencil size={15} />
              Editar servicio
            </button>

            {canDelete ? (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-danger-300 text-danger-600 rounded-lg hover:bg-danger-50 font-medium transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Eliminar servicio
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-neutral-50 rounded-lg text-sm text-neutral-400">
                <ShoppingCart size={15} />
                No se puede eliminar (tiene {service.salesCount} {service.salesCount === 1 ? "venta" : "ventas"})
              </div>
            )}

            {deleteError && (
              <p className="text-xs text-danger-500">{deleteError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
