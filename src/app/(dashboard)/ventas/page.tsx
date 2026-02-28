"use client";

import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Eye, Check, MessageCircle, X, User, Package, DollarSign,
  Calendar, FileText, ChevronDown, UserPlus, Phone, Mail,
  ArrowLeft, Loader2, Plus,
} from "lucide-react";

import { useCompany } from "@/hooks/useCompany";
import { useClients } from "@/hooks/useClients";
import { useServices } from "@/hooks/useServices";
import { useSales } from "@/hooks/useSales";

import { Client } from "@/lib/types/client/types";
import { Service } from "@/lib/types/service/types";
import { Sale } from "@/lib/types/sale/type";

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ isPaid }: { isPaid: boolean }) {
  return isPaid ? (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
      Pagada
    </span>
  ) : (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
      Pendiente
    </span>
  );
}

// ─── New Client Form (inline inside dropdown) ─────────────────────────────────

interface NewClientFormProps {
  onBack: () => void;
  onCreated: (client: Client) => void;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client | null>;
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
      if (client) onCreated(client);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el cliente. Intenta de nuevo.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <button type="button" onClick={onBack} className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer">
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-medium text-neutral-700">Nuevo cliente</span>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="text" placeholder="Nombre *" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>
        <div className="relative">
          <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="tel" placeholder="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>
        <div className="relative">
          <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>

        {error && <p className="text-xs text-danger-500">{error}</p>}

        <button type="button" onClick={handleSubmit} disabled={!name.trim() || isSubmitting}
          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            name.trim() && !isSubmitting ? "bg-primary-500 text-white hover:bg-primary-600" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}>
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
          Agregar cliente
        </button>
      </div>
    </div>
  );
}

// ─── New Service Form (inline inside dropdown) ────────────────────────────────

interface NewServiceFormProps {
  onBack: () => void;
  onCreated: (service: Service) => void;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service | null>;
}

function NewServiceForm({ onBack, onCreated, createService }: NewServiceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name.trim() || !price) return;
    setIsSubmitting(true);
    setError(null);
    const service = await createService({ name, description, price: parseFloat(price) });
    if (service) {
      onCreated(service);
    } else {
      setError("No se pudo crear el servicio. Intenta de nuevo.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <button type="button" onClick={onBack} className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer">
          <ArrowLeft size={16} />
        </button>
        <span className="text-sm font-medium text-neutral-700">Nuevo servicio</span>
      </div>

      <div className="space-y-2.5">
        <div className="relative">
          <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="text" placeholder="Nombre *" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>
        <div className="relative">
          <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input type="number" placeholder="Precio *" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300" />
        </div>

        {error && <p className="text-xs text-danger-500">{error}</p>}

        <button type="button" onClick={handleSubmit} disabled={!name.trim() || !price || isSubmitting}
          className={`w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            name.trim() && price && !isSubmitting ? "bg-primary-500 text-white hover:bg-primary-600" : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}>
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
          Agregar servicio
        </button>
      </div>
    </div>
  );
}

// ─── New Sale Modal ───────────────────────────────────────────────────────────

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  services: Service[];
  isClientsLoading: boolean;
  isServicesLoading: boolean;
  createSale: (data: { clientId: number; serviceId: number; amount: number; saleDate: string; dueDate?: string | null; notes?: string | null }) => Promise<Sale | null>;
  createClient: (data: { name: string; phone: string; email: string }) => Promise<Client | null>;
  createService: (data: { name: string; description: string; price: number }) => Promise<Service | null>;
}

function NewSaleModal({ isOpen, onClose, clients, services, isClientsLoading, isServicesLoading, createSale, createClient, createService }: NewSaleModalProps) {
  const [clientId, setClientId] = useState<number | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [clientView, setClientView] = useState<"list" | "new">("list");
  const [serviceView, setServiceView] = useState<"list" | "new">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === clientId);
  const selectedService = services.find((s) => s.id === serviceId);

  const handleServiceSelect = (service: Service) => {
    setServiceId(service.id);
    setAmount(service.price.toString());
    setShowServiceDropdown(false);
  };

  const handleClose = useCallback(() => {
    setClientId(null);
    setServiceId(null);
    setAmount("");
    setSaleDate(new Date().toISOString().split("T")[0]);
    setDueDate("");
    setNotes("");
    setShowClientDropdown(false);
    setShowServiceDropdown(false);
    setClientView("list");
    setServiceView("list");
    setSubmitError(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!clientId || !serviceId || !amount || !saleDate) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const sale = await createSale({
      clientId,
      serviceId,
      amount: parseFloat(amount),
      saleDate,
      dueDate: dueDate || null,
      notes: notes || null,
    });

    if (sale) {
      handleClose();
    } else {
      setSubmitError("No se pudo guardar la venta. Intenta de nuevo.");
    }
    setIsSubmitting(false);
  };

  const isFormValid = !!clientId && !!serviceId && !!amount && parseFloat(amount) > 0 && !!saleDate;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Registrar venta</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Completa los datos de la transacción</p>
            </div>
            <button onClick={handleClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto">
          <div className="space-y-5">

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Cliente <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <button type="button"
                  onClick={() => { setShowClientDropdown(!showClientDropdown); setShowServiceDropdown(false); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition cursor-pointer">
                  {selectedClient ? selectedClient.name : "Selecciona un cliente"}
                </button>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showClientDropdown ? "rotate-180" : ""}`} />

                {showClientDropdown && (
                  <div className="mt-1 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                    {clientView === "new" ? (
                      <NewClientForm
                        onBack={() => setClientView("list")}
                        createClient={createClient}
                        onCreated={(client) => {
                          setClientId(client.id);
                          setClientView("list");
                          setShowClientDropdown(false);
                        }}
                      />
                    ) : (
                      <>
                        <div className="max-h-36 overflow-y-auto">
                          {isClientsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 size={16} className="animate-spin text-neutral-400" />
                            </div>
                          ) : clients.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-neutral-400">No hay clientes aún</p>
                          ) : (
                            clients.map((client) => (
                              <button key={client.id} type="button"
                                onClick={() => { setClientId(client.id); setShowClientDropdown(false); }}
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer ${clientId === client.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"}`}>
                                <span className="font-medium">{client.name}</span>
                                {client.email && <span className="text-neutral-400 ml-2">{client.email}</span>}
                              </button>
                            ))
                          )}
                        </div>
                        <div className="border-t border-neutral-100">
                          <button type="button" onClick={() => setClientView("new")}
                            className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2">
                            <UserPlus size={16} />
                            <span className="font-medium">Crear nuevo cliente</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Servicio <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <button type="button"
                  onClick={() => { setShowServiceDropdown(!showServiceDropdown); setShowClientDropdown(false); }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition cursor-pointer">
                  {selectedService ? selectedService.name : "Selecciona un servicio"}
                </button>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showServiceDropdown ? "rotate-180" : ""}`} />

                {showServiceDropdown && (
                  <div className="mt-1 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
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
                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex justify-between items-center ${serviceId === service.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"}`}>
                                <span className="font-medium">{service.name}</span>
                                <span className="text-neutral-500">${Number(service.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                              </button>
                            ))
                          )}
                        </div>
                        <div className="border-t border-neutral-100">
                          <button type="button" onClick={() => setServiceView("new")}
                            className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2">
                            <Plus size={16} />
                            <span className="font-medium">Crear nuevo servicio</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Monto <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Fecha de venta <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Fecha límite de pago
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Notas</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <textarea placeholder="Detalles adicionales de la venta..." value={notes} onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition resize-none" />
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-danger-500 text-center">{submitError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3 justify-end">
          <button type="button" onClick={handleClose}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} disabled={!isFormValid || isSubmitting}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              isFormValid && !isSubmitting ? "bg-primary-500 text-white hover:bg-primary-600" : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}>
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
  onMarkAsPaid: (id: number) => void;
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
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
            {sale.client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{sale.client.name}</p>
            <p className="text-xs text-neutral-500">
              {new Date(sale.saleDate).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <StatusBadge isPaid={sale.isPaid} />
      </div>

      <div className="flex items-center gap-2 text-neutral-600">
        <Package size={14} className="text-neutral-400" />
        <span className="text-sm">{sale.service.name}</span>
      </div>

      <div>
        <p className="text-xs text-neutral-500 uppercase tracking-wide">Monto Total</p>
        <p className="text-2xl font-bold text-neutral-900">
          ${Number(sale.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
        <div className="flex items-center gap-2">
          <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
            <Eye size={18} />
          </button>
          <button
            onClick={handleMarkAsPaid}
            disabled={sale.isPaid || isMarking}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              sale.isPaid ? "text-success-500 hover:bg-success-50" : "text-neutral-400 hover:bg-neutral-100"
            } disabled:cursor-default`}>
            {isMarking ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
          </button>
        </div>
        <button className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
          sale.isPaid ? "text-success-600 hover:bg-success-50" : "text-warning-600 hover:bg-warning-50"
        }`}>
          <MessageCircle size={16} />
          {sale.isPaid ? "Recibo" : "Recordar"}
        </button>
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
  const { sales, isLoading, stats, last7Days, topServices, createSale, markAsPaid } = useSales(companyId);

  const isPageLoading = isCompanyLoading || isLoading;
  const visibleSales = sales.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Ventas</h1>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer font-medium transition-colors">
          + Nueva Venta
        </button>
        <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Ventas del mes {isPageLoading ? "..." : stats.monthSalesCount}
        </span>
        <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
          Pendientes {isPageLoading ? "..." : stats.pendingSalesCount}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">Total Ventas</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isPageLoading ? "..." : `$${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-success-600 uppercase tracking-wide font-medium">Recaudado</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isPageLoading ? "..." : `$${stats.collectedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-warning-600 uppercase tracking-wide font-medium">Por Cobrar</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {isPageLoading ? "..." : `$${stats.pendingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          </p>
        </div>
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
                    {topServices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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
            <button
              onClick={() => setVisibleCount((v) => v + 8)}
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
