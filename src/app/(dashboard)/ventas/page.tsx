"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Eye, Check, MessageCircle, X, User, Package, DollarSign, Calendar, FileText, ChevronDown, UserPlus, Phone, Mail, ArrowLeft } from "lucide-react";

const ventasDelMes = 24;
const ventasPendientes = 8;

const resumenVentas = {
  totalVentas: 42500.0,
  recaudado: 28150.0,
  porCobrar: 14350.0,
};

const ventasUltimos7Dias = [
  { dia: "Lun", ventas: 5 },
  { dia: "Mar", ventas: 8 },
  { dia: "Mié", ventas: 3 },
  { dia: "Jue", ventas: 12 },
  { dia: "Vie", ventas: 7 },
  { dia: "Sáb", ventas: 4 },
  { dia: "Dom", ventas: 2 },
];

const serviciosMasVendidos = [
  { nombre: "Diseño Web", cantidad: 12, color: "#6366F1" },
  { nombre: "Hosting", cantidad: 8, color: "#8B5CF6" },
  { nombre: "Mantenimiento", cantidad: 6, color: "#10B981" },
  { nombre: "Consultoría", cantidad: 4, color: "#F59E0B" },
];

const ventas = [
  {
    id: 1,
    cliente: "Maria Gonzalez",
    avatar: "/avatars/maria.jpg",
    tiempo: "Hace 2 horas",
    servicio: "Diseño Web Corporativo",
    icono: "palette",
    monto: 1250.0,
    estado: "pendiente",
  },
  {
    id: 2,
    cliente: "Carlos Ruiz",
    avatar: "/avatars/carlos.jpg",
    tiempo: "Ayer",
    servicio: "Lote de Repuestos #442",
    icono: "box",
    monto: 450.0,
    estado: "pagada",
  },
  {
    id: 3,
    cliente: "Luis Hernandez",
    avatar: "/avatars/luis.jpg",
    tiempo: "31 Oct, 2023",
    servicio: "Reparación Local A",
    icono: "wrench",
    monto: 320.0,
    estado: "pagada",
  },
  {
    id: 4,
    cliente: "Sofia Martí",
    avatar: "/avatars/sofia.jpg",
    tiempo: "28 Oct, 2023",
    servicio: "Envío Internacional",
    icono: "truck",
    monto: 1100.0,
    estado: "pendiente",
  },
];

const clientesMock = [
  { id: 1, name: "Maria Gonzalez", email: "maria@email.com" },
  { id: 2, name: "Carlos Ruiz", email: "carlos@email.com" },
  { id: 3, name: "Luis Hernandez", email: "luis@email.com" },
  { id: 4, name: "Sofia Martí", email: "sofia@email.com" },
  { id: 5, name: "Ana Lopez", email: "ana@email.com" },
];

const serviciosMock = [
  { id: 1, name: "Diseño Web Corporativo", price: 1250.0 },
  { id: 2, name: "Hosting Anual VPS", price: 150.0 },
  { id: 3, name: "Mantenimiento Mensual", price: 320.0 },
  { id: 4, name: "Consultoría IT", price: 450.0 },
  { id: 5, name: "Desarrollo App Móvil", price: 3500.0 },
];

function getEstadoBadge(estado: string) {
  if (estado === "pagada") {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
        Pagada
      </span>
    );
  }
  return (
    <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
      Pendiente
    </span>
  );
}

function getAccionBoton(estado: string) {
  if (estado === "pagada") {
    return (
      <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-success-600 hover:bg-success-50 rounded-lg transition-colors cursor-pointer">
        <MessageCircle size={16} />
        Recibo
      </button>
    );
  }
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-warning-600 hover:bg-warning-50 rounded-lg transition-colors cursor-pointer">
      <MessageCircle size={16} />
      Recordar
    </button>
  );
}

interface NuevaVentaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function NuevaVentaModal({ isOpen, onClose }: NuevaVentaModalProps) {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [monto, setMonto] = useState("");
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().split("T")[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [notas, setNotas] = useState("");
  const [showClienteDropdown, setShowClienteDropdown] = useState(false);
  const [showServicioDropdown, setShowServicioDropdown] = useState(false);
  const [clientes, setClientes] = useState(clientesMock);
  const [creandoCliente, setCreandoCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ name: "", phone: "", email: "" });

  const clienteSeleccionado = clientes.find((c) => c.id === clienteId);
  const servicioSeleccionado = serviciosMock.find((s) => s.id === servicioId);

  const handleServicioSelect = (id: number) => {
    setServicioId(id);
    const servicio = serviciosMock.find((s) => s.id === id);
    if (servicio) {
      setMonto(servicio.price.toString());
    }
    setShowServicioDropdown(false);
  };

  const handleCrearCliente = () => {
    if (!nuevoCliente.name.trim()) return;
    const newId = Math.max(...clientes.map((c) => c.id)) + 1;
    const cliente = { id: newId, name: nuevoCliente.name, email: nuevoCliente.email, phone: nuevoCliente.phone };
    setClientes([...clientes, cliente]);
    setClienteId(newId);
    setNuevoCliente({ name: "", phone: "", email: "" });
    setCreandoCliente(false);
    setShowClienteDropdown(false);
  };

  const handleSubmit = () => {
    console.log({
      clienteId,
      servicioId,
      monto: parseFloat(monto),
      fechaVenta,
      fechaVencimiento: fechaVencimiento || null,
      notas: notas || null,
    });
    onClose();
  };

  const isFormValid = clienteId && servicioId && monto && parseFloat(monto) > 0 && fechaVenta;
  const isNuevoClienteValid = nuevoCliente.name.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg mx-4 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Registrar venta</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Completa los datos de la transacción</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 max-h-[calc(100vh-220px)] overflow-y-auto">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Cliente <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => {
                    setShowClienteDropdown(!showClienteDropdown);
                    setShowServicioDropdown(false);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition cursor-pointer"
                >
                  {clienteSeleccionado ? clienteSeleccionado.name : "Selecciona un cliente"}
                </button>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showClienteDropdown ? "rotate-180" : ""}`} />

                {showClienteDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden">
                    {creandoCliente ? (
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() => setCreandoCliente(false)}
                            className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors cursor-pointer"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <span className="text-sm font-medium text-neutral-700">Nuevo cliente</span>
                        </div>
                        <div className="space-y-2.5">
                          <div className="relative">
                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                            <input
                              type="text"
                              placeholder="Nombre *"
                              value={nuevoCliente.name}
                              onChange={(e) => setNuevoCliente({ ...nuevoCliente, name: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                          </div>
                          <div className="relative">
                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                            <input
                              type="tel"
                              placeholder="Teléfono"
                              value={nuevoCliente.phone}
                              onChange={(e) => setNuevoCliente({ ...nuevoCliente, phone: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                          </div>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                            <input
                              type="email"
                              placeholder="Correo"
                              value={nuevoCliente.email}
                              onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleCrearCliente}
                            disabled={!isNuevoClienteValid}
                            className={`w-full py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                              isNuevoClienteValid
                                ? "bg-primary-500 text-white hover:bg-primary-600"
                                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                            }`}
                          >
                            Agregar cliente
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-36 overflow-y-auto">
                          {clientes.map((cliente) => (
                            <button
                              key={cliente.id}
                              type="button"
                              onClick={() => {
                                setClienteId(cliente.id);
                                setShowClienteDropdown(false);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer ${
                                clienteId === cliente.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"
                              }`}
                            >
                              <span className="font-medium">{cliente.name}</span>
                              {cliente.email && <span className="text-neutral-400 ml-2">{cliente.email}</span>}
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => setCreandoCliente(true)}
                            className="w-full px-4 py-2.5 text-left text-sm text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer flex items-center gap-2"
                          >
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

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Servicio <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <button
                  type="button"
                  onClick={() => {
                    setShowServicioDropdown(!showServicioDropdown);
                    setShowClienteDropdown(false);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-left text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition cursor-pointer"
                >
                  {servicioSeleccionado ? servicioSeleccionado.name : "Selecciona un servicio"}
                </button>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${showServicioDropdown ? "rotate-180" : ""}`} />

                {showServicioDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {serviciosMock.map((servicio) => (
                      <button
                        key={servicio.id}
                        type="button"
                        onClick={() => handleServicioSelect(servicio.id)}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-primary-50 transition-colors cursor-pointer flex justify-between items-center ${
                          servicioId === servicio.id ? "bg-primary-50 text-primary-700" : "text-neutral-700"
                        }`}
                      >
                        <span className="font-medium">{servicio.name}</span>
                        <span className="text-neutral-500">${servicio.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Monto <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Fecha de venta <span className="text-danger-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    value={fechaVenta}
                    onChange={(e) => setFechaVenta(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Fecha límite de pago
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="date"
                    value={fechaVencimiento}
                    onChange={(e) => setFechaVencimiento(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Notas
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <textarea
                  placeholder="Detalles adicionales de la venta..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              isFormValid
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Guardar venta
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VentasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-neutral-900">Ventas</h1>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 cursor-pointer font-medium transition-colors"
        >
          + Nueva Venta
        </button>
        <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
          Ventas del mes {ventasDelMes}
        </span>
        <span className="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
          Pendientes {ventasPendientes}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-neutral-500 uppercase tracking-wide font-medium">
            Total Ventas
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.totalVentas.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-success-600 uppercase tracking-wide font-medium">
            Recaudado
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.recaudado.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs text-warning-600 uppercase tracking-wide font-medium">
            Por Cobrar
          </p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            ${resumenVentas.porCobrar.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Ventas últimos 7 días
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasUltimos7Dias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dia" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="ventas" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">
            Servicios más vendidos
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviciosMasVendidos}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="cantidad"
                  nameKey="nombre"
                >
                  {serviciosMasVendidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-neutral-700 text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {ventas.map((venta) => (
          <div
            key={venta.id}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-medium">
                  {venta.cliente.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{venta.cliente}</p>
                  <p className="text-xs text-neutral-500">{venta.tiempo}</p>
                </div>
              </div>
              {getEstadoBadge(venta.estado)}
            </div>

            <div className="flex items-center gap-2 text-neutral-600">
              <span className="text-sm">{venta.servicio}</span>
            </div>

            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                Monto Total
              </p>
              <p className="text-2xl font-bold text-neutral-900">
                ${venta.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer">
                  <Eye size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    venta.estado === "pagada"
                      ? "text-success-500 hover:bg-success-50"
                      : "text-neutral-400 hover:bg-neutral-100"
                  }`}
                >
                  <Check size={18} />
                </button>
              </div>
              {getAccionBoton(venta.estado)}
            </div>
          </div>
        ))}
      </div>

      <button className="mx-auto text-neutral-500 hover:text-neutral-700 text-sm font-medium flex items-center gap-1 cursor-pointer">
        Ver más ventas
        <span className="text-xs">▼</span>
      </button>

      <NuevaVentaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
