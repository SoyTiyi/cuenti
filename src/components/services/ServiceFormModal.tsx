"use client";

import { useState, useEffect } from "react";
import { X, Package, FileText, DollarSign, Loader2 } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";
import type { Service, ServiceWithStats, UpdateServiceDTO } from "@/lib/types/service/types";

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceWithStats | null;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
  updateService: (id: number, data: UpdateServiceDTO) => Promise<void>;
}

export function ServiceFormModal({ isOpen, onClose, service, createService, updateService }: ServiceFormModalProps) {
  const isEditing = !!service;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen && service) {
      setName(service.name);
      setDescription(service.description);
      setPrice(String(service.price));
      setError(null);
    } else if (isOpen) {
      setName("");
      setDescription("");
      setPrice("");
      setError(null);
    }
  }, [isOpen, service]);

  if (!isOpen) return null;

  const isValid = name.trim().length > 0 && price.length > 0 && parseFloat(price) > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (isEditing && service) {
        await updateService(service.id, { name, description, price: parseFloat(price) });
      } else {
        await createService({ name, description, price: parseFloat(price) });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el servicio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">
              {isEditing ? "Editar servicio" : "Nuevo servicio"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nombre <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Package size={16} className="text-neutral-400" />
                </span>
                <input
                  type="text"
                  placeholder="Ej: Corte de cabello"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Descripción
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <FileText size={16} className="text-neutral-400" />
                </span>
                <input
                  type="text"
                  placeholder="Descripción del servicio"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Precio <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <DollarSign size={16} className="text-neutral-400" />
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                />
              </div>
            </div>

            {error && <p className="text-sm text-danger-500">{error}</p>}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear servicio"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
