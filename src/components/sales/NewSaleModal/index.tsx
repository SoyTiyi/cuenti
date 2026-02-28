"use client";

import { useState, useCallback } from "react";
import { X, DollarSign, Calendar, FileText, Loader2 } from "lucide-react";
import { Toggle } from "@/components/ui";
import { ClientSelect } from "./ClientSelect";
import { ServiceSelect } from "./ServiceSelect";
import type { Client } from "@/lib/types/client/types";
import type { Service } from "@/lib/types/service/types";
import type { Sale, CreateSaleDTO } from "@/lib/types/sale/type";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SaleFormData {
  clientId: number | null;
  serviceId: number | null;
  amount: string;
  saleDate: string;
  dueDate: string;
  notes: string;
  isPaid: boolean;
}

const INITIAL_FORM: SaleFormData = {
  clientId: null,
  serviceId: null,
  amount: "",
  saleDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  notes: "",
  isPaid: false,
};

export interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  services: Service[];
  isClientsLoading: boolean;
  isServicesLoading: boolean;
  createSale: (data: Omit<CreateSaleDTO, "companyId">) => Promise<Sale | null>;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client>;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NewSaleModal({
  isOpen, onClose,
  clients, services,
  isClientsLoading, isServicesLoading,
  createSale, createClient, createService,
}: NewSaleModalProps) {
  const [form, setForm] = useState<SaleFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof SaleFormData>(key: K, value: SaleFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setSubmitError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!form.clientId || !form.serviceId || !form.amount || !form.saleDate) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const sale = await createSale({
      clientId: form.clientId,
      serviceId: form.serviceId,
      amount: parseFloat(form.amount),
      saleDate: form.saleDate,
      dueDate: form.dueDate || null,
      notes: form.notes || null,
      isPaid: form.isPaid,
    });

    if (sale) {
      handleClose();
    } else {
      setSubmitError("No se pudo guardar la venta. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    !!form.clientId && !!form.serviceId &&
    !!form.amount && parseFloat(form.amount) > 0 && !!form.saleDate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Registrar venta</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Completa los datos de la transacción</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto space-y-5">

          <ClientSelect
            clients={clients}
            selectedId={form.clientId}
            isLoading={isClientsLoading}
            onSelect={(client) => update("clientId", client.id)}
            createClient={createClient}
          />

          <ServiceSelect
            services={services}
            selectedId={form.serviceId}
            isLoading={isServicesLoading}
            onSelect={(service) => {
              update("serviceId", service.id);
              update("amount", service.price.toString());
            }}
            createService={createService}
          />

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Monto <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DollarSign size={16} className="text-neutral-400" />
              </span>
              <input
                type="number" step="0.01" min="0" placeholder="0.00"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
              />
            </div>
          </div>

          {/* Already paid toggle */}
          <div className="py-1">
            <Toggle
              checked={form.isPaid}
              onChange={(val) => update("isPaid", val)}
              label="Venta ya pagada"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Fecha de venta <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar size={16} className="text-neutral-400" />
                </span>
                <input
                  type="date" value={form.saleDate}
                  onChange={(e) => update("saleDate", e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                />
              </div>
            </div>

            {!form.isPaid && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Fecha límite de pago
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar size={16} className="text-neutral-400" />
                  </span>
                  <input
                    type="date" value={form.dueDate}
                    onChange={(e) => update("dueDate", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notas</label>
            <div className="relative">
              <span className="absolute left-3 top-3 pointer-events-none">
                <FileText size={16} className="text-neutral-400" />
              </span>
              <textarea
                placeholder="Detalles adicionales..." value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none"
              />
            </div>
          </div>

          {submitError && <p className="text-sm text-danger-500 text-center">{submitError}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3 justify-end">
          <button
            type="button" onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button" onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Guardar venta
          </button>
        </div>
      </div>
    </div>
  );
}
