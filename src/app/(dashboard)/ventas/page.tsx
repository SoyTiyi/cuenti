"use client";

import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  X, DollarSign, Calendar, FileText, ChevronDown,
  UserPlus, Phone, Mail, ArrowLeft, Loader2, Plus,
  Check, MessageCircle, Eye, Package,
} from "lucide-react";

import { useCompany } from "@/hooks/useCompany";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useSales } from "@/hooks/useSales";

import type { Client } from "@/lib/types/client/types";
import type { Service } from "@/lib/types/service/types";
import type { Sale } from "@/lib/types/sale/type";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function ClientAvatar({ name }: { name: string }) {
  return (
    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ isPaid }: { isPaid: boolean }) {
  return isPaid ? (
    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
      Pagada
    </span>
  ) : (
    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
      Pendiente
    </span>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 w-full cursor-pointer group"
    >
      <div className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-success-500" : "bg-neutral-200"}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </div>
      <span className="text-sm font-medium text-neutral-700">{label}</span>
    </button>
  );
}

// ─── Inline Dropdown ──────────────────────────────────────────────────────────

interface DropdownWrapperProps {
  label: string;
  required?: boolean;
  displayValue: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  chevronOpen: boolean;
  children: React.ReactNode;
}

function DropdownWrapper({ label, required, displayValue, isOpen, onToggle, icon, chevronOpen, children }: DropdownWrapperProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none">
          {icon}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition cursor-pointer"
        >
          {displayValue}
        </button>
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none transition-transform ${chevronOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && (
        <div className="mt-1 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── New Client Form ──────────────────────────────────────────────────────────

interface NewClientFormProps {
  onBack: () => void;
  onCreated: (client: Client) => void;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client>;
}

function NewClientForm({ onBack, onCreated, createClient }: NewClientFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const client = await createClient({ name, phone, email });
      onCreated(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 space-y-2.5">
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer">
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-medium text-neutral-700">Nuevo cliente</span>
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <UserPlus size={14} className="text-neutral-400" />
        </span>
        <input type="text" placeholder="Nombre *" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Phone size={14} className="text-neutral-400" />
        </span>
        <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Mail size={14} className="text-neutral-400" />
        </span>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}

      <button type="button" onClick={handleSubmit} disabled={!name.trim() || isSubmitting}
        className="w-full py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer">
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        Agregar cliente
      </button>
    </div>
  );
}

// ─── New Service Form ─────────────────────────────────────────────────────────

interface NewServiceFormProps {
  onBack: () => void;
  onCreated: (service: Service) => void;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
}

function NewServiceForm({ onBack, onCreated, createService }: NewServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && price.length > 0 && parseFloat(price) > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const service = await createService({ name, description, price: parseFloat(price) });
      onCreated(service);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el servicio.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 space-y-2.5">
      <div className="flex items-center gap-2 mb-1">
        <button type="button" onClick={onBack} className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer">
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-medium text-neutral-700">Nuevo servicio</span>
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Package size={14} className="text-neutral-400" />
        </span>
        <input type="text" placeholder="Nombre *" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <FileText size={14} className="text-neutral-400" />
        </span>
        <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <DollarSign size={14} className="text-neutral-400" />
        </span>
        <input type="number" placeholder="Precio *" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}

      <button type="button" onClick={handleSubmit} disabled={!isValid || isSubmitting}
        className="w-full py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer">
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        Agregar servicio
      </button>
    </div>
  );
}

// ─── New Sale Modal ───────────────────────────────────────────────────────────

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

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  services: Service[];
  isClientsLoading: boolean;
  isServicesLoading: boolean;
  createSale: (data: {
    clientId: number; serviceId: number; amount: number;
    saleDate: string; dueDate?: string | null; notes?: string | null;
    isPaid?: boolean;
  }) => Promise<Sale | null>;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client>;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service>;
}

function NewSaleModal({
  isOpen, onClose, clients, services,
  isClientsLoading, isServicesLoading,
  createSale, createClient, createService,
}: NewSaleModalProps) {
  const [form, setForm] = useState<SaleFormData>(INITIAL_FORM);
  const [openDropdown, setOpenDropdown] = useState<"client" | "service" | null>(null);
  const [clientView, setClientView] = useState<"list" | "new">("list");
  const [serviceView, setServiceView] = useState<"list" | "new">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === form.clientId);
  const selectedService = services.find((s) => s.id === form.serviceId);

  const toggleDropdown = (name: "client" | "service") => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleServiceSelect = (service: Service) => {
    setForm((prev) => ({ ...prev, serviceId: service.id, amount: service.price.toString() }));
    setOpenDropdown(null);
  };

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM);
    setOpenDropdown(null);
    setClientView("list");
    setServiceView("list");
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

  const isFormValid = !!form.clientId && !!form.serviceId && !!form.amount && parseFloat(form.amount) > 0 && !!form.saleDate;

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
          <button onClick={handleClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto space-y-5">

          {/* Client */}
          <DropdownWrapper
            label="Cliente" required
            displayValue={selectedClient ? selectedClient.name : "Selecciona un cliente"}
            isOpen={openDropdown === "client"}
            onToggle={() => toggleDropdown("client")}
            icon={<UserPlus size={16} />}
            chevronOpen={openDropdown === "client"}
          >
            {clientView === "new" ? (
              <NewClientForm
                onBack={() => setClientView("list")}
                createClient={createClient}
                onCreated={(client) => {
                  setForm((prev) => ({ ...prev, clientId: client.id }));
                  setClientView("list");
                  setOpenDropdown(null);
                }}
              />
            ) : (
              <>
                <div className="max-h-40 overflow-y-auto">
                  {isClientsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 size={16} className="animate-spin text-neutral-400" />
                    </div>
                  ) : clients.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-neutral-400">No hay clientes aún</p>
                  ) : (
                    clients.map((client) => (
                      <button key={client.id} type="button"
                        onClick={() => { setForm((prev) => ({ ...prev, clientId: client.id })); setOpenDropdown(null); }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-3 ${form.clientId === client.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"}`}>
                        <ClientAvatar name={client.name} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{client.name}</p>
                          {client.email && <p className="text-xs text-neutral-400 truncate">{client.email}</p>}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-neutral-100">
                  <button type="button" onClick={() => setClientView("new")}
                    className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2 font-medium">
                    <Plus size={16} />
                    Crear nuevo cliente
                  </button>
                </div>
              </>
            )}
          </DropdownWrapper>

          {/* Service */}
          <DropdownWrapper
            label="Servicio" required
            displayValue={selectedService ? selectedService.name : "Selecciona un servicio"}
            isOpen={openDropdown === "service"}
            onToggle={() => toggleDropdown("service")}
            icon={<Package size={16} />}
            chevronOpen={openDropdown === "service"}
          >
            {serviceView === "new" ? (
              <NewServiceForm
                onBack={() => setServiceView("list")}
                createService={createService}
                onCreated={(service) => {
                  handleServiceSelect(service);
                  setServiceView("list");
                }}
              />
            ) : (
              <>
                <div className="max-h-48 overflow-y-auto">
                  {isServicesLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 size={16} className="animate-spin text-neutral-400" />
                    </div>
                  ) : services.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-neutral-400">No hay servicios aún</p>
                  ) : (
                    services.map((service) => (
                      <button key={service.id} type="button" onClick={() => handleServiceSelect(service)}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex justify-between items-center gap-2 ${form.serviceId === service.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"}`}>
                        <span className="font-medium truncate">{service.name}</span>
                        <span className="text-neutral-500 flex-shrink-0">{formatCurrency(Number(service.price))}</span>
                      </button>
                    ))
                  )}
                </div>
                <div className="border-t border-neutral-100">
                  <button type="button" onClick={() => setServiceView("new")}
                    className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2 font-medium">
                    <Plus size={16} />
                    Crear nuevo servicio
                  </button>
                </div>
              </>
            )}
          </DropdownWrapper>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Monto <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <DollarSign size={16} className="text-neutral-400" />
              </span>
              <input type="number" step="0.01" min="0" placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
            </div>
          </div>

          {/* Already paid toggle */}
          <div className="py-1">
            <Toggle
              checked={form.isPaid}
              onChange={(val) => setForm((prev) => ({ ...prev, isPaid: val, dueDate: val ? "" : prev.dueDate }))}
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
                <input type="date" value={form.saleDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, saleDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
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
                  <input type="date" value={form.dueDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
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
              <textarea placeholder="Detalles adicionales..." value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none" />
            </div>
          </div>

          {submitError && <p className="text-sm text-danger-500 text-center">{submitError}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3 justify-end">
          <button type="button" onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} disabled={!isFormValid || isSubmitting}
            className="px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer">
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            Guardar venta
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sale Card ────────────────────────────────────────────────────────────────

interface SaleCardProps {
  sale: Sale;
  onMarkAsPaid: (id: number) => Promise<boolean>;
}

function SaleCard({ sale, onMarkAsPaid }: SaleCardProps) {
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsPaid = async () => {
    if (sale.isPaid) return;
    setIsMarking(true);
    await onMarkAsPaid(sale.id);
    setIsMarking(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <ClientAvatar name={sale.client.name} />
          <div className="min-w-0">
            <p className="font-medium text-neutral-900 truncate">{sale.client.name}</p>
            <p className="text-xs text-neutral-500">{formatDate(sale.saleDate)}</p>
          </div>
        </div>
        <StatusBadge isPaid={sale.isPaid} />
      </div>

      {/* Service */}
      <div className="flex items-center gap-2 text-neutral-600">
        <Package size={14} className="text-neutral-400 flex-shrink-0" />
        <span className="text-sm truncate">{sale.service.name}</span>
      </div>

      {/* Amount */}
      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wide">Monto Total</p>
        <p className="text-2xl font-bold text-neutral-900">{formatCurrency(Number(sale.amount))}</p>
      </div>

      {/* Actions */}
      <div className="pt-2 border-t border-neutral-100">
        {sale.isPaid ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-success-600">
              <Check size={16} />
              <span className="text-sm font-medium">Pagada</span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-success-600 hover:bg-success-50 rounded-lg transition-colors cursor-pointer">
              <MessageCircle size={15} />
              Recibo
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button className="p-2 text-neutral-400 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <Eye size={18} />
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-warning-600 hover:bg-warning-50 rounded-lg transition-colors cursor-pointer">
                <MessageCircle size={15} />
                Recordar
              </button>
              <button
                onClick={handleMarkAsPaid}
                disabled={isMarking}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-success-500 hover:bg-success-600 rounded-lg transition-colors cursor-pointer disabled:opacity-60">
                {isMarking ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                Marcar pagada
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SalesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  const { companyId, isLoading: isCompanyLoading } = useCompany();
  const { clients, isLoading: isClientsLoading, createClient } = useClients(companyId);
  const { services, isLoading: isServicesLoading, createService } = useServices(companyId);
  const { sales, isLoading: isSalesLoading, stats, last7Days, topServices, createSale, markAsPaid } = useSales(companyId);

  const isPageLoading = isCompanyLoading || isSalesLoading;
  const visibleSales = sales.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Ventas</h1>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer font-medium transition-colors">
          + Nueva Venta
        </button>
        <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Ventas del mes: {isPageLoading ? "..." : stats.monthSalesCount}
        </span>
        <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
          Pendientes: {isPageLoading ? "..." : stats.pendingSalesCount}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Ventas", value: stats.totalAmount, color: "text-neutral-500" },
          { label: "Recaudado", value: stats.collectedAmount, color: "text-success-600" },
          { label: "Por Cobrar", value: stats.pendingAmount, color: "text-warning-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5">
            <p className={`text-xs uppercase tracking-wide font-medium ${color}`}>{label}</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">
              {isPageLoading ? "..." : formatCurrency(value)}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Ventas últimos 7 días</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
                <Bar dataKey="sales" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Servicios más vendidos</h2>
          <div className="h-64">
            {topServices.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
                Sin datos aún
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={topServices} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="quantity" nameKey="name">
                    {topServices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={topServices[index].color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
                  <Legend formatter={(value) => <span className="text-neutral-700 text-sm">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Sales list */}
      {isPageLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : sales.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-neutral-400 text-sm">No hay ventas registradas aún.</p>
          <button onClick={() => setIsModalOpen(true)}
            className="mt-4 px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer font-medium transition-colors text-sm">
            Registrar primera venta
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {visibleSales.map((sale) => (
              <SaleCard key={sale.id} sale={sale} onMarkAsPaid={markAsPaid} />
            ))}
          </div>
          {visibleCount < sales.length && (
            <button onClick={() => setVisibleCount((v) => v + 8)}
              className="mx-auto text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 cursor-pointer">
              Ver más ventas <span className="text-xs">▼</span>
            </button>
          )}
        </>
      )}

      <NewSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
        services={services}
        isClientsLoading={isCompanyLoading || isClientsLoading}
        isServicesLoading={isCompanyLoading || isServicesLoading}
        createSale={createSale}
        createClient={createClient}
        createService={createService}
      />
    </div>
  );
}
